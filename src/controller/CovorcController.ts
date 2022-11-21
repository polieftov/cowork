import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    JsonController,
    OnUndefined,
    Param,
    Post,
    Req
} from 'routing-controllers'
import 'reflect-metadata'
import bcrypt from 'bcrypt'
import {User} from '../models/User.js'
import log4js from "log4js";
import {Covorc} from "../models/Covorc.js";

const logger = log4js.getLogger()

@JsonController()
export class CovorcController {
    @Get('/covorcs/:id')
    async getOne (@Param('id') id: number) {
        let covorc: Covorc[] = await Covorc.findAll({where: {id: id}});
        logger.debug(`get covorcs ${covorc.map(c => c.title)}`);
        return JSON.stringify(covorc);
    }

    @Get('/covorcs')
    async getAll() {
        logger.debug(`get all covorcs`);
        return JSON.stringify(await Covorc.findAll());
    }

    @Post('/covorcs')
    @HttpCode(200)
    @OnUndefined(500)
    async createUser(@Body() covorc: Covorc) {
        Covorc.create(covorc)
    }

    @Delete('/covorcs/:id')
    async deleteOne (@Param('id') id: number) {
        await Covorc.destroy({
            where: {
                id: id
            }
        });
        logger.debug(`Covorc with id = ${id} was deleted`);
    }
}
