import {Body, Delete, Get, HttpCode, JsonController, OnUndefined, Param, Post, Put} from 'routing-controllers'
import 'reflect-metadata'
import log4js from "log4js";
import {Covorc} from "../models/Covorc.js";
import {CovorcSection} from "../models/CovorcSection.js";
import {sequelize} from "../models/dbconnection.js";
import {QueryTypes} from "sequelize";

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

    getCovorcs(): Promise<CovorcToGet[]> {
        const query = `
        select c.id, c.title, c."shortDescription", c.schedule, c.address, max(cs.price) "maxPrice", min(cs.price) "minPrice"
        from covorcs c
        join covorc_sections cs on c.id = cs."covorcId"
        group by c.id
        `
        return sequelize.query(query, {type: QueryTypes.SELECT})
    }
}

type CovorcToGet = {
    id: number,
    title: string,
    shortDescription: string,
    schedule: string,
    maxPrice: number;
    minPrice: number;
    address: string;
}