import {Body, Delete, Get, HttpCode, JsonController, OnUndefined, Param, Post} from 'routing-controllers'
import 'reflect-metadata'
import log4js from "log4js";
import {Role} from "../models/Role.js";

const logger = log4js.getLogger()

@JsonController()
export class RolesController {
    @Get('/roles/:id')
    async getOne (@Param('id') id: number) {
        let role = await Role.findByPk(id);
        logger.debug(`get roles ${role.title}`);
        return JSON.stringify(role);
    }

    @Get('/roles')
    async getAll() {
        logger.debug(`get all users`);
        return JSON.stringify(await Role.findAll());
    }

    /**
     * {
     *    firstName: "",
     *    lastName: "",
     *    login: "",
     *    phoneNumber: "",
     *    password: ""
     * }
     */
    @Post('/roles')
    @HttpCode(200)
    @OnUndefined(500)
    async createRole(@Body() role: Role) {
        Role.create(role).then(role => logger.debug(`role ${role.title} created`))
    }

    @Delete('/roles/:id')
    async deleteOne (@Param('id') id: number) {
        await Role.destroy({
            where: {
                id: id
            }
        });
        logger.debug(`role with id = ${id} was deleted`);
    }
}
