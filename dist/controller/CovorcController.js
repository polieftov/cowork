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
import { Body, Delete, Get, HttpCode, JsonController, OnUndefined, Param, Post, Put } from 'routing-controllers';
import 'reflect-metadata';
import log4js from "log4js";
import { Covorc } from "../models/Covorc.js";
import { sequelize } from "../models/dbconnection.js";
import { QueryTypes } from "sequelize";
import { Covorc2CovorcSection, CovorcSection2Facilities } from "../models/CovorcSection.js";
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
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            logger.debug(`get all covorcs`);
            return JSON.stringify(yield this.getCovorcs());
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
     *
     *
     */
    createCovorc(covorc) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Covorc.create(covorc, {
                include: [{
                        association: Covorc2CovorcSection,
                        as: 'covorcSections'
                    }]
            }).then(c => {
                const createdCovorcSections = c.dataValues['covorcSections'];
                const covorcSectionsObj = covorc.covorcSections;
                createdCovorcSections.forEach(created => {
                    created.facilities = covorcSectionsObj.find(covSec => {
                        return covSec.description === created.description && covSec.placesCount === created.placesCount &&
                            covSec.price === created.price && covSec.sectionTypeId === created.sectionTypeId;
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
    getCovorcs() {
        const query = `
        select c.id, c.title, c."shortDescription", c."monWorkTime", c."tueWorkTime", c."wedWorkTime", c."thuWorkTime",
        c."friWorkTime", c."satWorkTime", c."sunWorkTime", c.address, max(cs.price) "maxPrice", min(cs.price) "minPrice"
        from covorcs c
        join covorc_sections cs on c.id = cs."covorcId"
        group by c.id
        `;
        return sequelize.query(query, { type: QueryTypes.SELECT });
    }
    getCovorcWithFacilitiesIds(covorcId) {
        const query = `
        select cov.*, array_agg(distinct f.id) facilities from covorcs cov
        join covorc_sections cs on cs."covorcId" = cov.id
        join "CovorcSection2Facilities" cf on cf."covorcSection" = cs.id
        join facilities f on f.id = cf.facilities
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
    Get('/covorcs')
], CovorcController.prototype, "getAll", null);
__decorate([
    Post('/covorcs'),
    HttpCode(200),
    OnUndefined(500),
    __param(0, Body())
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