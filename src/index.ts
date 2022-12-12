import dotenv from 'dotenv';
import log4js from 'log4js';
import { createExpressServer } from 'routing-controllers';
import { UserController } from './controller/UserController.js';
import swaggerUi from 'swagger-ui-express';
import {TestController} from "./controller/TestController.js";
import {sequelize} from './models/dbconnection.js'
import {CovorcSectionController} from "./controller/CovorcSectionController.js";
import {CovorcController} from "./controller/CovorcController.js";
import {CovorcSectionType, initCovorcSectionTypes} from "./models/CovorcSectionType.js";
import {Facilities, initFacilities} from "./models/Facilities.js";
import {BookingController} from "./controller/BookingController.js";
import {RolesController} from "./controller/RolesController.js";
import {User} from "./models/User.js";
import {Covorc} from "./models/Covorc.js";
import {ForeignKey} from "sequelize";
import {CovorcSection, CovorcSection2Facilities} from "./models/CovorcSection.js";

dotenv.config()
const logger = log4js.getLogger()
const port = process.env.PORT

logger.level = process.env.LOG_LEVEL


async function fillTestData() {
  initCovorcSectionTypes();
  initFacilities();
  initUsers();
  initCovorcs();
  await initCovorcSections();
}




function initCovorcSections(): Promise<void> {
  Covorc.findOne({where: {title: "Супер-коворк"}}).then(covorc => {
    CovorcSection.findOrCreate({
      where: {
        covorcId: covorc.id,
        description: "секция с опенспейсом",
        sectionTypeId: 1,
        placesCount: 25,
        price: 100
      }
    }).then((covorcSection) => {
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 1}});
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 2}});
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 3}});
    });
  });
  Covorc.findOne({where: {title: "Супер-коворк"}}).then(covorc => {
    CovorcSection.findOrCreate({
      where: {
        covorcId: covorc.id,
        description: "переговорка местная",
        sectionTypeId: 2,
        placesCount: 15,
        price: 200,
      }
    }).then((covorcSection) => {
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 1}});
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 2}});
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 3}});
    });
  });
  Covorc.findOne({where: {title: "Супер-пупер коворкинг"}}).then(covorc => {
    CovorcSection.findOrCreate({
      where: {
        covorcId: covorc.id,
        description: "элитный опенспайс",
        sectionTypeId: 1,
        placesCount: 15,
        price: 500,
      }
    }).then((covorcSection) => {
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 1}});
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 2}});
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 3}});
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 4}});
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 5}});
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 6}});
    });
  });
  Covorc.findOne({where: {title: "Супер-пупер переговорка"}}).then(covorc => {
    CovorcSection.findOrCreate({
      where: {
        covorcId: covorc.id,
        description: "элитная переговорка",
        sectionTypeId: 2,
        placesCount: 18,
        price: 800,
      }
    }).then((covorcSection) => {
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 1}});
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 2}});
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 3}});
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 4}});
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 5}});
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 6}});
    });
  });
  const kek = Covorc.findOne({where: {title: "Супер-пупер аудитория"}}).then(covorc => {
    CovorcSection.findOrCreate({
      where: {
        covorcId: covorc.id,
        description: "элитная переговорка",
        sectionTypeId: 3,
        placesCount: 100,
        price: 30000,
      }
    }).then((covorcSection) => {
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 1}});
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 2}});
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 3}});
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 4}});
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 5}});
      CovorcSection2Facilities.findOrCreate({where: {covorcSection: covorcSection[0].id, facilities: 6}});
    });
  });
  return kek
}

function initCovorcs() {
  User.findOne({where: {login: "user1"}}).then(user => {
    Covorc.findOrCreate({
      where: {
        title: "Супер-коворк",
        description: "У нас вообще отличный коворкинг, придешь, уходить не зачхочешь, это невероятно, мы тут живем и всем советуем! Кофе, чай, печенье, все четко, электричество, вода, еда, все есть!",
        shortDescription: "У нас супер коворкинг, приходите!",
        schedule: "Пн-Вс - 8:00 - 21:00",
        address: "г. Екатеринбург ул. Ленина 1 к2",
        contacts: "Тел 89213492131",
        ownerId: user.id,
      }
    });
  });
  User.findOne({where: {login: "user1"}}).then(user => {
    Covorc.findOrCreate({
      where: {
        title: "Супер-пупер коворкинг",
        description: "У нас вообще очень отличный коворкинг, лучший в мире, придешь, уходить не зачхочешь, это невероятно, мы тут живем и всем советуем! Кофе, чай, печенье, все четко, электричество, вода, еда, все есть!",
        shortDescription: "У нас супер коворкинг, приходите!",
        schedule: "Пн-Вc",
        address: "г. Екатеринбург ул. Ленина 111",
        contacts: "Тел 8921349777",
        ownerId: user.id,
      }
    });
  })
}

function initUsers() {
  User.findOrCreate({
    where: {
      login: 'user1',
      email: 'user1@mail.com',
      password: '$2b$10$kgXWKiqGxStsc/8OFELhbuI5tZu70mjvm010MOFqO87eP6ZSqMv1i',
      phoneNumber: '89999999999'
    } //password - 123
  });
  User.findOrCreate({
    where: {
      login: 'user2',
      email: 'user2@mail.com',
      password: '$2b$10$kgXWKiqGxStsc/8OFELhbuI5tZu70mjvm010MOFqO87eP6ZSqMv1i',
      phoneNumber: '89999999999'
    }
  });
}

sequelize.sync({ alter: true }).catch((reason) => console.log(reason)).then(() => {
  logger.debug("All models were synchronized successfully.")

  //инициализация типов, являющихся перечислением
  fillTestData();
});


const app = createExpressServer({
  controllers: [
    UserController,
    CovorcController,
    CovorcSectionController,
    BookingController,
    RolesController,
    TestController
  ]
})
//sync({ force: true})  This creates the table, dropping it first if it already existed
//.sync({ alter: true }) - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.

// const loadJSON = (path) => JSON.parse(readFileSync(path).toString());
// const swaggerDocument = loadJSON("../swagger/openapi.json")
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => console.log(`Running on localhost:${process.env.PORT}`))
