import {Body, Delete, Get, HttpCode, JsonController, OnUndefined, Param, Post, Put} from 'routing-controllers'
import 'reflect-metadata'
import log4js from "log4js";
import {Covorc} from "../models/Covorc.js";
import {sequelize} from "../models/dbconnection.js";
import {QueryTypes} from "sequelize";
import MultiGeocoder from 'multi-geocoder'
import {Covorc2CovorcSection, CovorcSection, CovorcSection2Facilities} from "../models/CovorcSection.js";

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
     *     userId: 1,
     *     covorcSections: [{
     *              description: "",
     *              sectionTypeId: 1,
     *              placesCount: 1,
     *              price: 1,
     *              facilities: [1,2,3]
     *     }]
     * }
     *
     *
     *
     */
    @Post('/covorcs')
    @HttpCode(200)
    @OnUndefined(500)
    async createCovorc(@Body() covorc: CovorcWithSectionsToCreate) {
        return await Covorc.create(covorc, {
            include: [{
                association: Covorc2CovorcSection,
                as: 'covorcSections'
            }]
        }).then(c => {
            const createdCovorcSections: CovorcSectionWithFacilities[] = c.dataValues['covorcSections']
            const covorcSectionsObj = covorc.covorcSections

            createdCovorcSections.forEach(created => {
                created.facilities = covorcSectionsObj.find(covSec => {
                    return covSec.description === created.description && covSec.placesCount === created.placesCount &&
                        covSec.price === created.price && covSec.sectionTypeId === created.sectionTypeId;
                }).facilities;
            });

            if (createdCovorcSections) {
                createdCovorcSections.forEach(covorcSection => {
                    logger.debug(covorcSection.facilities)
                    if (covorcSection.facilities)
                        covorcSection.facilities.map(facId => {
                            CovorcSection2Facilities.create({
                                covorcSection: covorcSection.id,
                                facilities: facId
                            });
                        });
                });
            }
            logger.debug(c.title + " создан");
        }).catch(ex => logger.info(ex));
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
    async deleteOne(@Param('id') id: number) {
        await Covorc.destroy({
            where: {
                id: id
            }
        });
        logger.debug(`Covorc with id = ${id} was deleted`);
    }

    getCovorcs(): Promise<CovorcToGet[]> {
        const query = `
        select c.id, c.title, c."shortDescription", c."monWorkTime", c."tueWorkTime", c."wedWorkTime", c."thuWorkTime",
        c."friWorkTime", c."satWorkTime", c."sunWorkTime", c.address, max(cs.price) "maxPrice", min(cs.price) "minPrice"
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
                replacements: {covorc_id: covorcId},
                type: QueryTypes.SELECT
            }
        )
    }
}

type CovorcSectionWithFacilities = CovorcSection & {
    facilities: number[];
}

type CovorcWithSectionsToCreate = Covorc & {
    covorcSections: CovorcSectionWithFacilities[]
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

type CovorcToGetWithGeo = CovorcToGet & {
    geo: string[]
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