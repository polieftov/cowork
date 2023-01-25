import {
    Body,
    Delete,
    Get,
    HttpCode,
    JsonController,
    OnUndefined,
    Param,
    Post,
    QueryParam,
    UseAfter
} from 'routing-controllers'
import 'reflect-metadata'
import log4js from "log4js";
import {CovorcSection} from "../models/CovorcSection.js";
import {Booking, BookingByHour} from "../models/Booking.js";
import {User} from "../models/User.js";
import {loggingMiddleware} from "./Middleware/Auth.js";
import {sequelize} from "../models/dbconnection.js";
import {ForeignKey, QueryTypes} from "sequelize";

const logger = log4js.getLogger()

@JsonController()
@UseAfter(loggingMiddleware)
export class BookingController {
    //Date format 15.01.2023,00:00:00
    @Get('/bookings/booked')
    async getBookingsByCovorcSectionsAndDatePeriod(
        @QueryParam("covorcSection") covorcSectionId: number,
        @QueryParam("beginDate") beginDate: string,
        @QueryParam("endDate") endDate: string,
        @QueryParam("countOfPeople") countOfPeople: number
    ): Promise<BookingsByHour[]> {
        const query = `select bbh."date", to_char(bbh."date", 'dd')::numeric "day", to_char(bbh."date", 'hh24')::numeric "hour", 
         sum(b."countOfPeople") countOfPeople, max(cs."placesCount") as placesCount,
         max(cs."placesCount") - sum(b."countOfPeople") avaiblePlaces
         from "bookingByHours" bbh
         join bookings b on b.id = bbh."bookingId"
         join covorc_sections cs on cs.id = b."covorcSectionId"
         where cs.id = ${covorcSectionId} and bbh."date" between '${beginDate}' and '${endDate}'
         group by "day", "hour", bbh."date"
         having max(cs."placesCount") - sum(b."countOfPeople") < ${countOfPeople}
         order by "day", "hour", bbh."date"`

        const res: Promise<BookingsByHour[]> = sequelize.query(
            query,
            {
                type: QueryTypes.SELECT
            }
        ).then((seq: BookingsByHour[]) => {
            return seq.map(booking => {
                booking.hour = Number(booking.hour) + 5;
                if (booking.hour >= 24)
                    booking.day = Number(booking.day) + 1;
                booking.date.setHours(booking.date.getHours() + 5);
                return booking;
            })
        })


        return res
    }

    @Get('/bookings')
    @HttpCode(200)
    async getAll(@QueryParam("userId") userId: number) {
        logger.debug(`get all bookings`);
        if (userId)
            return Booking.findAll({ where: {userId: userId}, include: [CovorcSection, User] });
        return JSON.stringify(await Booking.findAll({include: [CovorcSection, User]}));
    }

    /**
     * {
     *     price: 1,
     *     hours: 1,
     *     countOfPeople: 1,
     *     date: "2012-04-23T18:25:43.511",
     *     userId: 1,
     *     covorcSectionId: 1
     * }
     */
    @Post('/bookings')
    @HttpCode(200)
    @OnUndefined(400)
    async createCovorcSection(@Body() booking: Booking) {
        const createdBooking: Booking = await Booking.create(booking).then(b => {
            logger.debug(`create booking ${b.id}`);
            return b;
        });

        let bookingDate = createdBooking.date;
        let bookingByHourDates = [];
        for (let i = createdBooking.hours; i > 0; i--) {
            bookingByHourDates.push(new Date(bookingDate));
            bookingDate.setHours(bookingDate.getHours() + 1);
        }

        bookingByHourDates.map(bookingByHourDate => {
            return BookingByHour.create({
                date: bookingByHourDate,
                bookingId: createdBooking.id
            }).catch(ex => logger.info(ex))
        });

        return createdBooking;
   }

    @Delete('/bookings/:id')
    @HttpCode(200)
    @OnUndefined(400)
    async deleteOne (@Param('id') id: number) {
        await Booking.destroy({
            where: {
                id: id
            }
        });
        logger.debug(`booking with id = ${id} was deleted`);
    }
}

type BookingsByHour = {
    date: Date
    day: number
    hour: number
    countOfPeople: number
    placesCount: number
    availablePlacesCount: number
}
