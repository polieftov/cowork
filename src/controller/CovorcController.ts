import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    JsonController,
    OnUndefined,
    Param,
    Post, Put,
    Req
} from 'routing-controllers'
import 'reflect-metadata'
import log4js from "log4js";
import {Covorc} from "../models/Covorc.js";
import {User} from "../models/User.js";
import bcrypt from 'bcrypt'

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

    /**
     * {
     *     title: "",
     *     description: "",
     *     schedule: "",
     *     shortDescription: "",
     *     address: "",
     *     contacts: "",
     *     userId: 1
     * }
     */
    @Post('/covorcs')
    @HttpCode(200)
    @OnUndefined(500)
    async createCovorc(@Body() covorc: Covorc) {
        return await Covorc.create(covorc).then(c =>
            console.log(c.title + " создан")
        );
    }

    @Put('/covorcs/:id')
    async updateCovorc(@Param('id') id: number, @Body() covorc: Covorc) {
        await Covorc.findByPk(id).then(c => c.set(covorc))
            .catch(ex => logger.debug(ex))
            .then(c => {
                if (c instanceof Covorc)
                    logger.debug(`${c.title} covorc updated`)
            })
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
        return await Covorc.findAll({include: [User]}).then(x => {
                return x.map(covorc => {
                    return {
                        id: covorc.id,
                        title: covorc.title,
                        shortDesc: covorc.shortDescription,
                        schedule: covorc.schedule,
                        maxPrice: covorc.getMaxPrice(),
                        minPrice: covorc.getMinPrice(),
                        address: covorc.address,
                        user: covorc['user']
                    }
                })
            }
        )
    }

}
