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
import {Booking} from "../models/Booking.js";
import {User} from "../models/User.js";
import {loggingMiddleware} from "./Middleware/Auth.js";
import {sequelize} from "../models/dbconnection.js";
import {QueryTypes} from "sequelize";

const logger = log4js.getLogger()

@JsonController()
@UseAfter(loggingMiddleware)
export class BookingController {
    @Get('/bookings/free')
    async getBookingsByCovorcSectionsAndDatePeriod(
        @QueryParam("covorcSection") covorcSectionId: number,
        @QueryParam("beginDate") beginDate: Date,
        @QueryParam("endDate") endDate: Date
    ): Promise<BookingsByHour[]> {
        const query = `select bbh."date", to_char(bbh."date", 'dd') "day", to_char(bbh."date", 'hh24') "hour", 
         sum(b."countOfPeople") countOfPeople, max(cs."placesCount") as placesCount,
         max(cs."placesCount") - sum(b."countOfPeople") avaiblePlaces
         from "bookingByHours" bbh
         join bookings b on b.id = bbh."bookingId"
         join covorc_sections cs on cs.id = b."covorcSectionId"
         where cs.id = ${covorcSectionId} and bbh."date" between ${beginDate} and ${endDate} 
         group by "day", "hour", bbh."date"
         order by "day", "hour", bbh."date"`

        return sequelize.query(
            query,
            {
                type: QueryTypes.SELECT
            }
        )
    }

    @Get('/bookings/:id')
    @HttpCode(200)
    @OnUndefined(400)
    async getOne(@Param('id') id: number) {
        return JSON.stringify(await Booking.findByPk(id).then(b => {
            logger.debug(`get booking ${b.id}`);
        }));
    }

    @Get('/bookings')
    @HttpCode(200)
    async getAll() {
        logger.debug(`get all bookings`);
        return JSON.stringify(await Booking.findAll({include: [CovorcSection, User]}));
    }



    /**
     * {
     *     price: 1,
     *     hours: 1,
     *     countOfPeoples: 1,
     *     date: "2012-04-23T18:25:43.511Z",
     *     userId: 1,
     *     covorcSectionId: 1
     * }
     */
    @Post('/bookings')
    @HttpCode(200)
    @OnUndefined(400)
    async createCovorcSection(@Body() booking: Booking) {
        return await Booking.create(booking).then(b => {
            logger.debug(`create booking ${b.id}`);
            return b;
        })
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
