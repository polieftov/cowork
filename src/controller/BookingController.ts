import {Body, Delete, Get, HttpCode, JsonController, OnUndefined, Param, Post} from 'routing-controllers'
import 'reflect-metadata'
import log4js from "log4js";
import {CovorcSection} from "../models/CovorcSection.js";
import {Booking} from "../models/Booking.js";
import {User} from "../models/User.js";

const logger = log4js.getLogger()

@JsonController()
export class BookingController {
    @Get('/booking/:id')
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

    @Post('/bookings')
    @HttpCode(200)
    @OnUndefined(400)
    async createCovorcSection(@Body() booking: Booking) {
        await Booking.create(booking).then(b => {
            logger.debug(`create booking ${b.id}`)
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
