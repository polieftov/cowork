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
import bcrypt from 'bcrypt'
import {User} from '../models/User.js'
import log4js from "log4js";

const logger = log4js.getLogger()

@JsonController()
export class UserController {
  @Get('/users/:id')
  async getOne (@Param('id') id: number) {
    let user: User[] = await User.findAll({where: {id: id}});
    logger.debug(`get user ${user.map(u => u.login)}`);
    return JSON.stringify(user);
  }

  @Get('/users')
  async getAll() {
    logger.debug(`get all users`);
    return JSON.stringify(await User.findAll());
  }

  @Post('/users')
  @HttpCode(200)
  @OnUndefined(500)
  async createUser(@Body() user: User) {
    const createdUser = User.build(user)
    bcrypt.hash(user.password, 10).then(hashedPass => {
      createdUser.set({
        password: hashedPass
      });
      logger.debug(`${user.login} user created and saved`)
      createdUser.save();
    }).catch(ex => logger.error(ex))
  }

  @Delete('/users/:id')
  async deleteOne (@Param('id') id: number) {
    await User.destroy({
      where: {
        id: id
      }
    });
    logger.debug(`user with id = ${id} was deleted`);
  }
}
