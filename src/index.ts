import dotenv from 'dotenv';
import log4js from 'log4js';
import { createExpressServer } from 'routing-controllers';
import { UserController } from './controller/UserController.js';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger/openapi.json';
import {TestController} from "./controller/TestController.js";
import {sequelize} from './models/dbconnection.js'
import {CovorcController} from "./controller/CovorcController.js";
import {CovorcSectionController} from "./controller/CovorcSectionController.js";

dotenv.config()
const logger = log4js.getLogger()
const port = process.env.PORT

logger.level = process.env.LOG_LEVEL

const app = createExpressServer({
  controllers: [UserController, CovorcController, CovorcSectionController, TestController]
})
//sync({ force: true})  This creates the table, dropping it first if it already existed
//.sync({ alter: true }) - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
sequelize.sync({ force: true }).catch((reason) => console.log(reason)).then(() => logger.debug("All models were synchronized successfully."));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => console.log(`Running on localhost:${process.env.PORT}`))
