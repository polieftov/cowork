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
import jsonwebtoken from 'jsonwebtoken'
import {response} from "express";

const logger = log4js.getLogger()

type Credentials = {
  login: string,
  email: string,
  password: string
}

//Возвращается при авторизации
class UserWithJWT extends User {
  jwt: string;
  message: string;
}

@JsonController()
export class UserController {

  @Post('/register')
  @OnUndefined(404)
  async signUp(@Body() credentials: Credentials): Promise<User> {
    const createdUser = User.build(credentials)
    bcrypt.hash(credentials.password, 10).then(hashedPass => {
      createdUser.set({
        password: hashedPass
      });
    })
    logger.debug(`${createdUser.login} user created and saved`)
    return createdUser.save().catch(ex => {
      logger.debug(ex);
      return undefined;
    });
  }

  @Post('/login')
  @OnUndefined(404)
  async signIn(@Body() credentials: Credentials): Promise<UserWithJWT> {
    let user: User = null
    if (credentials.login)
      user = await User.findOne({ where: {login: credentials.login}})
    else if (credentials.email)
      user = await User.findOne({ where: {email: credentials.email}})
    else {
      let userNotFound: UserWithJWT = new UserWithJWT()
      userNotFound.message = "Wrong login or email"
      return userNotFound;
    }

    let passwordIsValid: Boolean = bcrypt.compareSync(
        credentials.password,
        user.password
    );
    if (!passwordIsValid) {
      let userNotFound: UserWithJWT = new UserWithJWT()
      userNotFound.message = "Wrong password"
      return userNotFound;
    }

    let token = jsonwebtoken.sign({
      id: user.id
    }, process.env.API_SECRET, {
      expiresIn: 86400
    });

    let userWithJWT = new UserWithJWT();
    userWithJWT.login = user.login;
    userWithJWT.firstName = user.firstName;
    userWithJWT.lastName = user.lastName;
    userWithJWT.id = user.id;
    userWithJWT.jwt = token;
    userWithJWT.message = "Success";
    return userWithJWT
    //https://www.topcoder.com/thrive/articles/authentication-and-authorization-in-express-js-api-using-jwt
  }

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

  /**
   * {
   *    firstName: "",
   *    lastName: "",
   *    login: "",
   *    phoneNumber: "",
   *    password: ""
   * }
   */
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
