import dotenv from 'dotenv';
import log4js from 'log4js';
import { createExpressServer } from 'routing-controllers';
import { UserController } from './controller/UserController.js';
import { TestController } from "./controller/TestController.js";
import { sequelize } from './models/dbconnection.js';
import { CovorcSectionController } from "./controller/CovorcSectionController.js";
import { CovorcController } from "./controller/CovorcController.js";
import { initCovorcSectionTypes } from "./models/CovorcSectionType.js";
import { initFacilities } from "./models/Facilities.js";
import { BookingController } from "./controller/BookingController.js";
dotenv.config();
const logger = log4js.getLogger();
const port = process.env.PORT;
logger.level = process.env.LOG_LEVEL;
sequelize.sync({ alter: true }).catch((reason) => console.log(reason)).then(() => {
    logger.debug("All models were synchronized successfully.");
    //инициализация типов, являющихся перечислением
    initCovorcSectionTypes();
    initFacilities();
});
const app = createExpressServer({
    controllers: [UserController, CovorcController, CovorcSectionController, BookingController, TestController]
});
//sync({ force: true})  This creates the table, dropping it first if it already existed
//.sync({ alter: true }) - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
// const loadJSON = (path) => JSON.parse(readFileSync(path).toString());
// const swaggerDocument = loadJSON("../swagger/openapi.json")
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(port, () => console.log(`Running on localhost:${process.env.PORT}`));
//# sourceMappingURL=index.js.map