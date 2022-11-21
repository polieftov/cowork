import log4js from "log4js";
import dotenv from "dotenv";
import {Sequelize} from 'sequelize';

const logger = log4js.getLogger()

dotenv.config()
logger.debug(process.env.DB_NAME)
logger.debug(process.env.DB_USER)
logger.debug(process.env.DB_PASS)

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        dialect: 'postgres',
    }
)
logger.debug(sequelize)
sequelize
    .authenticate()
    .then(() => logger.debug('Connected.'))
    .catch((err) => logger.error('Connection error: ', err))