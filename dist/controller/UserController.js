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
import { Body, Delete, Get, HttpCode, JsonController, OnUndefined, Param, Post } from 'routing-controllers';
import 'reflect-metadata';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import log4js from "log4js";
const logger = log4js.getLogger();
let UserController = class UserController {
    getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield User.findAll({ where: { id: id } });
            logger.debug(`get user ${user.map(u => u.login)}`);
            return JSON.stringify(user);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            logger.debug(`get all users`);
            return JSON.stringify(yield User.findAll());
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdUser = User.build(user);
            bcrypt.hash(user.password, 10).then(hashedPass => {
                createdUser.set({
                    password: hashedPass
                });
                logger.debug(`${user.login} user created and saved`);
                createdUser.save();
            }).catch(ex => logger.error(ex));
        });
    }
    deleteOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield User.destroy({
                where: {
                    id: id
                }
            });
            logger.debug(`user with id = ${id} was deleted`);
        });
    }
};
__decorate([
    Get('/users/:id'),
    __param(0, Param('id'))
], UserController.prototype, "getOne", null);
__decorate([
    Get('/users')
], UserController.prototype, "getAll", null);
__decorate([
    Post('/users'),
    HttpCode(200),
    OnUndefined(500),
    __param(0, Body())
], UserController.prototype, "createUser", null);
__decorate([
    Delete('/users/:id'),
    __param(0, Param('id'))
], UserController.prototype, "deleteOne", null);
UserController = __decorate([
    JsonController()
], UserController);
export { UserController };
//# sourceMappingURL=UserController.js.map