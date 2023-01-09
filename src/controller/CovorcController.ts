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
    async getOne(@Param('id') id: number): Promise<CovorcWithFacilities> {
        return this.getCovorcWithFacilitiesIds(id).then(covorc => {
            logger.debug(`get covorc ${covorc[0].title}`);
            return covorc[0];
        });
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

    getCovorcWithFacilitiesIds(covorcId: number): Promise<CovorcWithFacilities[]> {
        const query = `
        select cov.*, array_agg(distinct f.id) facilities from covorcs cov
        join covorc_sections cs on cs."covorcId" = cov.id
        join "CovorcSection2Facilities" cf on cf."covorcSection" = cs.id
        join facilities f on f.id = cf.facilities
        where cov.id = :covorc_id
        group by cov.id 
        `
        return sequelize.query(
            query,
            {
                replacements: { covorc_id: covorcId },
                type: QueryTypes.SELECT
            }
        )
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

type CovorcWithFacilities = {
    id: number
    title: string
    description: string
    schedule: string
    address: string
    contacts: string
    facilities: number[]
}