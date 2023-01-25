var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Body, Delete, Get, HttpCode, JsonController, OnUndefined, Param, Post, Put, QueryParam, UploadedFiles } from 'routing-controllers';
import 'reflect-metadata';
import log4js from "log4js";
import { Covorc } from "../models/Covorc.js";
import { sequelize } from "../models/dbconnection.js";
import { QueryTypes } from "sequelize";
import { Covorc2CovorcSection, CovorcSection2Facilities } from "../models/CovorcSection.js";
import multer from 'multer';
import { CovorcSectionsPictures } from "../models/CovorcSectionsPictures.js";
const logger = log4js.getLogger();
let CovorcController = class CovorcController {
    getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getCovorcWithFacilitiesIds(id).then(covorc => {
                logger.debug(`get covorc ${covorc[0].title}`);
                return covorc[0];
            });
        });
    }
    getAll(titleFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.debug(`get all covorcs`);
            return this.getCovorcs(titleFilter);
        });
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
     * return CovorcSectionWithFacilities[] созданные секции
     *
     */
    createCovorc(covorc, files) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Covorc.create(covorc, {
                include: [{
                        association: Covorc2CovorcSection,
                        as: 'covorcSections'
                    }]
            }).then(c => {
                const createdCovorcSections = c.dataValues['covorcSections'];
                const covorcSectionsObj = covorc.covorcSections;
                //загружаем файлы
                covorcSectionsObj.forEach(covSec => covSec['files'].map(f => {
                    const createId = createdCovorcSections.find(cs => {
                        return cs.description === covSec.description && covSec.placesCount == cs.placesCount &&
                            cs.price == covSec.price && covSec.sectionTypeId === cs.sectionTypeId;
                    }).id;
                    return CovorcSectionsPictures.create({
                        filename: f,
                        path: './static',
                        covorcSectionId: createId
                    });
                }));
                createdCovorcSections.forEach(created => {
                    created.facilities = covorcSectionsObj.find(covSec => {
                        return covSec.description == created.description && covSec.placesCount == created.placesCount &&
                            covSec.price == created.price && covSec.sectionTypeId == created.sectionTypeId;
                    }).facilities;
                });
                if (createdCovorcSections) {
                    createdCovorcSections.forEach(covorcSection => {
                        logger.debug(covorcSection.facilities);
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
                return createdCovorcSections;
            }).catch(ex => logger.info(ex));
        });
    }
    updateCovorc(id, covorc) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Covorc.findByPk(id).then(c => c.set(covorc))
                .catch(ex => logger.debug(ex))
                .then(c => {
                if (c instanceof Covorc)
                    logger.debug(`${c.title} covorc updated`);
            });
        });
    }
    deleteOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Covorc.destroy({
                where: {
                    id: id
                }
            });
            logger.debug(`Covorc with id = ${id} was deleted`);
        });
    }
    addTitleFilter(title) {
        if (title)
            return `c.title ilike '%${title}%'`;
        else
            return "true";
    }
    getCovorcs(titleFilter) {
        const query = `
        select c.id, c.title, c."shortDescription", c."monWorkTime", c."tueWorkTime", c."wedWorkTime", c."thuWorkTime",
        c."friWorkTime", c."satWorkTime", c."sunWorkTime", c.address, max(cs.price) "maxPrice", min(cs.price) "minPrice",
        array_agg(distinct csp.filename) photos
        from covorcs c
        join covorc_sections cs on c.id = cs."covorcId"
        left join covorc_section_pictures csp on csp."covorcSectionId" = cs.id
        where ${this.addTitleFilter(titleFilter)}
        group by c.id
        `;
        return sequelize.query(query, { type: QueryTypes.SELECT });
    }
    getCovorcWithFacilitiesIds(covorcId) {
        const query = `
        select cov.*, array_agg(distinct f.id) facilities, array_agg(distinct csp.filename) photos from covorcs cov
        join covorc_sections cs on cs."covorcId" = cov.id
        join "CovorcSection2Facilities" cf on cf."covorcSection" = cs.id
        join facilities f on f.id = cf.facilities
        left join covorc_section_pictures csp on csp."covorcSectionId" = cs.id
        where cov.id = :covorc_id
        group by cov.id
        `;
        return sequelize.query(query, {
            replacements: { covorc_id: covorcId },
            type: QueryTypes.SELECT
        });
    }
};
__decorate([
    Get('/covorcs/:id'),
    __param(0, Param('id'))
], CovorcController.prototype, "getOne", null);
__decorate([
    Get('/covorcs'),
    __param(0, QueryParam("titleFilter"))
], CovorcController.prototype, "getAll", null);
__decorate([
    Post('/covorcs'),
    HttpCode(200),
    OnUndefined(500),
    __param(0, Body()),
    __param(1, UploadedFiles("files", {
        options: {
            storage: multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, './static');
                },
                filename: function (req, file, cb) {
                    let [filename, ext] = file.originalname.split('.');
                    cb(null, `${filename}-${Date.now()}.${ext}`);
                }
            })
        }
    }))
], CovorcController.prototype, "createCovorc", null);
__decorate([
    Put('/covorcs/:id'),
    __param(0, Param('id')),
    __param(1, Body())
], CovorcController.prototype, "updateCovorc", null);
__decorate([
    Delete('/covorcs/:id'),
    __param(0, Param('id'))
], CovorcController.prototype, "deleteOne", null);
CovorcController = __decorate([
    JsonController()
], CovorcController);
export { CovorcController };
//# sourceMappingURL=CovorcController.js.map