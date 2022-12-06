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
import {CovorcSection, CovorcSection2Facilities} from "../models/CovorcSection.js";
import {Covorc} from "../models/Covorc.js";
import {Facilities} from "../models/Facilities.js";
import {CovorcSectionType} from "../models/CovorcSectionType.js";

const logger = log4js.getLogger()

type CovorcSectionWithFacilities = CovorcSection & {
    facilities: number[];
}

@JsonController()
export class CovorcSectionController {
    @Get('/covorc_sections/:id')
    @HttpCode(200)
    @OnUndefined(400)
    async getOne(@Param('id') id: number) {
        let covorc: CovorcSection[] = await CovorcSection.findAll({
            where: {id: id},
            include: [Covorc, Facilities, CovorcSectionType]
        });
        logger.debug(`get covorc_sections ${covorc.map(c => c.id)}`);
        return JSON.stringify(covorc);
    }

    /** Вся информация о секции, включая коворкинг, к которому относится */
    @Get('/covorc_sections')
    @HttpCode(200)
    async getAll() {
        logger.debug(`get all covorc_sections`);
        return JSON.stringify(await CovorcSection.findAll({include: [Covorc, Facilities, CovorcSectionType]}));
    }


    /**
     * {
     *     covorcId: 1,
     *     description: "",
     *     sectionTypeId: 1,
     *     placesCount: 1,
     *     price: 1,
     *     facilities: [1,2,3]
     * }
     */
    @Post('/covorc_sections')
    @HttpCode(200)
    @OnUndefined(400)
    async createCovorcSection(@Body() covorcSections: CovorcSectionWithFacilities) {
        CovorcSection.create(covorcSections)
        if (covorcSections.facilities)
            covorcSections.facilities.map(facId => {
                CovorcSection2Facilities.create({
                    covorcSection: covorcSections.id,
                    facilities: facId
                })
            })

    }

    @Delete('/covorc_sections/:id')
    @HttpCode(200)
    @OnUndefined(400)
    async deleteOne (@Param('id') id: number) {
        await CovorcSection.destroy({
            where: {
                id: id
            }
        });
        logger.debug(`covorc_section with id = ${id} was deleted`);
    }
}
