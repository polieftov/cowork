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
import log4js from "log4js";
import {Covorc} from "../models/Covorc.js";

const logger = log4js.getLogger()

@JsonController()
export class CovorcController {
    @Get('/covorcs/:id')
    async getOne(@Param('id') id: number) {
        let covorc: Covorc[] = await Covorc.findAll({where: {id: id}});
        logger.debug(`get covorcs ${covorc.map(c => c.title)}`);
        return JSON.stringify(covorc);
    }

    @Get('/covorcs')
    async getAll() {
        logger.debug(`get all covorcs`);
        return JSON.stringify(await this.getCovorcs());
    }

    @Post('/covorcs')
    @HttpCode(200)
    @OnUndefined(500)
    async createCovorc(@Body() covorc: Covorc) {
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

    async getCovorcs() {
        return await Covorc.findAll().then(x => {
                return x.map(covorc => {
                    return {
                        id: covorc.id,
                        title: covorc.title,
                        shortDesc: covorc.shortDescription,
                        schedule: covorc.schedule,
                        maxPrice: covorc.getMaxPrice(),
                        minPrice: covorc.getMinPrice(),
                        address: covorc.address
                    }
                })
            }
        )
    }

}
