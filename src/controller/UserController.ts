import {
  Body,
  BodyParam,
  Delete,
  Get, HeaderParam,
  HttpCode,
  JsonController,
  OnUndefined,
  Param,
  Post,
  Req,
  Res
} from 'routing-controllers'
import 'reflect-metadata'
import bcrypt from 'bcrypt'
import {User} from '../models/User.js'
import log4js from "log4js";
import jsonwebtoken from 'jsonwebtoken'
import {Op} from "sequelize";
import {Booking} from "../models/Booking.js";
import * as express from "express";

const logger = log4js.getLogger()

type Credentials = {
  login: string,
  email: string,
  password: string
}

//Возвращается при успешной авторизации
class UserWithJWT extends User {
  jwt: string;
  message: string;
}

@JsonController()
export class UserController {

  /**
   * {
   *    login: "",
   *    email: "",
   *    password: ""
   * }
   */
  @Post('/register')
  @OnUndefined(404)
  async signUp(@Body() credentials: User): Promise<User> {
    const userWithEmailOrLogin = await User.findOne({
      where: {
        [Op.or]: [
          { login: credentials.login },
          { email: credentials.email }
        ]
      }
    });
    if (userWithEmailOrLogin)
      return userWithEmailOrLogin;
    const createdUser = User.build(credentials)
    return bcrypt.hash(credentials.password, 10).then(hashedPass => {
      createdUser.set({
        password: hashedPass
      });
      return createdUser.save().then(user => {
        logger.debug(`${user.login} user created and saved`)
        return user
      }).catch(ex => {
        logger.debug(ex);
        return undefined;
      })
    }).catch(ex => {
      logger.debug(ex + " pass cannot be hashed")
      return undefined;
    })
  }

  //результат можно понять по message
  @Post('/login')
  @OnUndefined(401)
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

  @Get('/auth/jwt')
  async authWithJWT(@HeaderParam("Authorization") authValue: string): Promise<AuthWithJWT> {
    if (authValue)
      return jsonwebtoken.verify(authValue, process.env.API_SECRET, async function (err, decode) {
        if (decode)
          return User.findByPk(decode.id).then(user => {
            return {user: user, exception: undefined}
          }).catch(ex => {
            logger.debug(ex);
            return {exception: ex, user: undefined}
          });
        else
          return {user: undefined, exception: err}
      });
    else
      return {exception: 'No JWT Token!', user: undefined}
  }

  @Get('/users/:id')
  async getOne (@Param('id') id: number): Promise<User> {
    let user: User = await User.findByPk(id);
    logger.debug(`get user ${user.login}`);
    return user;
  }

  @Get('/users/bookings/:id')
  async getBookingsByUserId(@Param('id') id: number): Promise<Booking[]> {
    return Booking.findAll({where: {userId: id}, order: ['date', 'DESC']});
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

type AuthWithJWT = {
  user: User
  exception: string
}