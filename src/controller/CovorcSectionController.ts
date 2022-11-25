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
import {CovorcSection} from "../models/CovorcSection.js";

const logger = log4js.getLogger()

@JsonController()
export class CovorcSectionController {
    @Get('/covorc_sections/:id')
    @HttpCode(200)
    @OnUndefined(400)
    async getOne(@Param('id') id: number) {
        let covorc: CovorcSection[] = await CovorcSection.findAll({where: {id: id}});
        logger.debug(`get covorc_sections ${covorc.map(c => c.id)}`);
        return JSON.stringify(covorc);
    }

    @Get('/covorc_sections')
    @HttpCode(200)
    async getAll() {
        logger.debug(`get all covorc_sections`);
        return JSON.stringify(await CovorcSection.findAll());
    }

    @Post('/covorc_sections')
    @HttpCode(200)
    @OnUndefined(400)
    async createCovorcSection(@Body() covorcSections: CovorcSection) {
        CovorcSection.create(covorcSections)
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
