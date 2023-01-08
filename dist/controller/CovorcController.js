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
const logger = log4js.getLogger();
let CovorcController = class CovorcController {
    getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let covorc = yield Covorc.findByPk(id);
            logger.debug(`get covorc ${covorc.title}`);
            return JSON.stringify(covorc);
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
     *     userId: 1
     * }
     */
    createCovorc(covorc) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Covorc.create(covorc).then(c => console.log(c.title + " создан"));
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
        select c.id, c.title, c."shortDescription", c.schedule, c.address, max(cs.price) "maxPrice", min(cs.price) "minPrice"
        from covorcs c
        join covorc_sections cs on c.id = cs."covorcId"
        group by c.id
        `;
        return sequelize.query(query, { type: QueryTypes.SELECT });
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