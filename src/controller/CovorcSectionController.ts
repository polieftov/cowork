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
    Req,
    Res,
    UploadedFiles
} from 'routing-controllers'
import 'reflect-metadata'
import log4js from "log4js";
import {CovorcSection, CovorcSection2Facilities} from "../models/CovorcSection.js";
import {Covorc} from "../models/Covorc.js";
import {Facilities} from "../models/Facilities.js";
import {CovorcSectionType} from "../models/CovorcSectionType.js";
import multer from 'multer'
import {CovorcSectionsPictures} from "../models/CovorcSectionsPictures.js";
import * as path from "path";
import * as express from "express"

const logger = log4js.getLogger()

type CovorcSectionWithFacilities = CovorcSection & {
    facilities: number[];
}

@JsonController()
export class CovorcSectionController {
    @Get('/covorc_sections')
    @HttpCode(200)
    @OnUndefined(404)
    async getOneByCovorcId(@QueryParam("covorcId") covorcId: number): Promise<CovorcSection[]> {
        return CovorcSection.findAll({
            where: {covorcId: covorcId},
            include: [Facilities, CovorcSectionType, CovorcSectionsPictures]
        }).then(covSections => JSON.stringify(covSections))
            .catch(ex => {
                logger.debug(ex);
                return undefined;
            })
    }

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

    @Post('/covorc_sections/photo/:covorcSectionId')
    @HttpCode(200)
    @OnUndefined(400)
    async loadCovorcSectionPhotos(@UploadedFiles("files", {
                                      options: {
                                          storage: multer.diskStorage({
                                              destination: function (req, file, cb) {
                                                  cb(null, './static')
                                              },
                                              filename: function (req, file, cb) {
                                                  let [filename, ext] = file.originalname.split('.')
                                                  cb(null, `${filename}-${Date.now()}.${ext}`)
                                              }
                                          })
                                      }
                                  }) files: File[],
                                  @Param('covorcSectionId') covorcSectionId: number
    ) {

        logger.debug(files);
        return files.map(f => {
            return CovorcSectionsPictures.create({
                filename: f['originalname'],
                path: './static',
                covorcSectionId: covorcSectionId
            });
        });
    }

    @Post('/covorc_sections/load_photos/')
    @HttpCode(200)
    @OnUndefined(400)
    async loadPhotos(@UploadedFiles("files", {
                                      options: {
                                          storage: multer.diskStorage({
                                              destination: function (req, file, cb) {
                                                  cb(null, './static')
                                              },
                                              filename: function (req, file, cb) {
                                                  let [filename, ext] = file.originalname.split('.')
                                                  cb(null, `${filename}-${Date.now()}.${ext}`)
                                              }
                                          })
                                      }
                                  }) files: File[]
    ) {

        logger.debug(files);
        return files.map(f => f['originalName'])
    }

    @Get('/covorc_sections/photo/:name')
    async GetFile(@Req() request: any, @Res() response: express.Response, @Param('name') name: string) {
        const __dirname = path.resolve();
        let filePath = path.join(__dirname, '/static', name);
        const sendFilePromise = await new Promise(() => response.sendFile(filePath, ex => {
            if (ex)
                logger.debug(ex)
            else
                logger.debug('File: ' + filePath)
        }));

        return response.status(200);
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
