var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from 'dotenv';
import log4js from 'log4js';
import { createExpressServer } from 'routing-controllers';
import { UserController } from './controller/UserController.js';
import { TestController } from "./controller/TestController.js";
import { sequelize } from './models/dbconnection.js';
import { CovorcSectionController } from "./controller/CovorcSectionController.js";
import { CovorcController } from "./controller/CovorcController.js";
import { BookingController } from "./controller/BookingController.js";
import { RolesController } from "./controller/RolesController.js";
import { User } from "./models/User.js";
import { Covorc } from "./models/Covorc.js";
import { CovorcSection, CovorcSection2Facilities } from "./models/CovorcSection.js";
import { Booking, BookingByHour } from "./models/Booking.js";
dotenv.config();
const logger = log4js.getLogger();
const port = process.env.PORT;
logger.level = process.env.LOG_LEVEL;
function fillTestData() {
    return __awaiter(this, void 0, void 0, function* () {
        const scriptBookingByHours = `
    INSERT INTO public."bookingByHours" ("date","createdAt","updatedAt","bookingId") VALUES
     ('2023-01-22 19:00:00+05','2023-01-26 14:54:42.084+05','2023-01-26 14:54:42.084+05',1),
     ('2023-01-22 17:00:00+05','2023-01-26 14:54:42.092+05','2023-01-26 14:54:42.092+05',2),
     ('2023-01-22 16:00:00+05','2023-01-26 14:54:42.102+05','2023-01-26 14:54:42.102+05',3),
     ('2023-01-22 15:00:00+05','2023-01-26 14:54:42.103+05','2023-01-26 14:54:42.103+05',1),
     ('2023-01-22 17:00:00+05','2023-01-26 14:54:42.113+05','2023-01-26 14:54:42.113+05',4),
     ('2023-01-22 17:00:00+05','2023-01-26 14:54:42.117+05','2023-01-26 14:54:42.117+05',5),
     ('2023-01-22 13:00:00+05','2023-01-26 14:54:42.125+05','2023-01-26 14:54:42.125+05',6),
     ('2023-01-22 14:00:00+05','2023-01-26 14:54:42.127+05','2023-01-26 14:54:42.127+05',6),
     ('2023-01-22 15:00:00+05','2023-01-26 14:54:42.128+05','2023-01-26 14:54:42.128+05',6),
     ('2023-01-22 16:00:00+05','2023-01-26 14:54:42.129+05','2023-01-26 14:54:42.129+05',6);
    INSERT INTO public."bookingByHours" ("date","createdAt","updatedAt","bookingId") VALUES
    ('2023-01-23 11:00:00+05','2023-01-26 14:54:42.14+05','2023-01-26 14:54:42.14+05',7),
    ('2023-01-23 12:00:00+05','2023-01-26 14:54:42.141+05','2023-01-26 14:54:42.141+05',7),
    ('2023-01-23 09:00:00+05','2023-01-26 14:54:42.142+05','2023-01-26 14:54:42.142+05',7),
    ('2023-01-23 10:00:00+05','2023-01-26 14:54:42.143+05','2023-01-26 14:54:42.143+05',7),
    ('2023-01-23 08:00:00+05','2023-01-26 14:54:42.144+05','2023-01-26 14:54:42.144+05',7),
    ('2023-01-23 13:00:00+05','2023-01-26 14:54:42.154+05','2023-01-26 14:54:42.154+05',7),
    ('2023-01-23 14:00:00+05','2023-01-26 14:54:42.155+05','2023-01-26 14:54:42.155+05',7),
    ('2023-01-23 15:00:00+05','2023-01-26 14:54:42.157+05','2023-01-26 14:54:42.157+05',7),
    ('2023-01-23 16:00:00+05','2023-01-26 14:54:42.16+05','2023-01-26 14:54:42.16+05',7),
    ('2023-01-23 17:00:00+05','2023-01-26 14:54:42.161+05','2023-01-26 14:54:42.161+05',7);
    INSERT INTO public."bookingByHours" ("date","createdAt","updatedAt","bookingId") VALUES
    ('2023-01-23 18:00:00+05','2023-01-26 14:54:42.167+05','2023-01-26 14:54:42.167+05',7),
    ('2023-01-23 19:00:00+05','2023-01-26 14:54:42.168+05','2023-01-26 14:54:42.168+05',7);
    `;
        const scriptCovorcSections2facilities = `
    INSERT INTO public."CovorcSection2Facilities" ("covorcSection",facilities,"createdAt","updatedAt","covorcSectionId","facilityId") VALUES
    (2,1,'2023-01-26 14:54:41.973+05','2023-01-26 14:54:41.973+05',NULL,NULL),
    (2,2,'2023-01-26 14:54:41.975+05','2023-01-26 14:54:41.975+05',NULL,NULL),
    (2,3,'2023-01-26 14:54:42.007+05','2023-01-26 14:54:42.007+05',NULL,NULL),
    (2,4,'2023-01-26 14:54:42.008+05','2023-01-26 14:54:42.008+05',NULL,NULL),
    (2,5,'2023-01-26 14:54:42.014+05','2023-01-26 14:54:42.014+05',NULL,NULL),
    (2,6,'2023-01-26 14:54:42.015+05','2023-01-26 14:54:42.015+05',NULL,NULL),
    (1,1,'2023-01-26 14:54:42.018+05','2023-01-26 14:54:42.018+05',NULL,NULL),
    (1,3,'2023-01-26 14:54:42.022+05','2023-01-26 14:54:42.022+05',NULL,NULL),
    (1,2,'2023-01-26 14:54:42.025+05','2023-01-26 14:54:42.025+05',NULL,NULL),
    (4,1,'2023-01-26 14:54:42.034+05','2023-01-26 14:54:42.034+05',NULL,NULL);
    INSERT INTO public."CovorcSection2Facilities" ("covorcSection",facilities,"createdAt","updatedAt","covorcSectionId","facilityId") VALUES
    (4,2,'2023-01-26 14:54:42.038+05','2023-01-26 14:54:42.038+05',NULL,NULL),
    (4,3,'2023-01-26 14:54:42.044+05','2023-01-26 14:54:42.044+05',NULL,NULL),
    (4,4,'2023-01-26 14:54:42.048+05','2023-01-26 14:54:42.048+05',NULL,NULL),
    (4,5,'2023-01-26 14:54:42.049+05','2023-01-26 14:54:42.049+05',NULL,NULL),
    (4,6,'2023-01-26 14:54:42.055+05','2023-01-26 14:54:42.055+05',NULL,NULL),
    (3,1,'2023-01-26 14:54:42.056+05','2023-01-26 14:54:42.056+05',NULL,NULL),
    (3,2,'2023-01-26 14:54:42.065+05','2023-01-26 14:54:42.065+05',NULL,NULL),
    (3,3,'2023-01-26 14:54:42.066+05','2023-01-26 14:54:42.066+05',NULL,NULL),
    (5,1,'2023-01-26 14:54:42.068+05','2023-01-26 14:54:42.068+05',NULL,NULL),
    (5,2,'2023-01-26 14:54:42.07+05','2023-01-26 14:54:42.07+05',NULL,NULL);
    INSERT INTO public."CovorcSection2Facilities" ("covorcSection",facilities,"createdAt","updatedAt","covorcSectionId","facilityId") VALUES
    (5,3,'2023-01-26 14:54:42.071+05','2023-01-26 14:54:42.071+05',NULL,NULL),
    (5,4,'2023-01-26 14:54:42.078+05','2023-01-26 14:54:42.078+05',NULL,NULL),
    (5,5,'2023-01-26 14:54:42.079+05','2023-01-26 14:54:42.079+05',NULL,NULL),
    (5,6,'2023-01-26 14:54:42.081+05','2023-01-26 14:54:42.081+05',NULL,NULL),
    (6,1,'2023-01-26 14:58:58.044+05','2023-01-26 14:58:58.044+05',NULL,NULL),
    (6,5,'2023-01-26 14:58:58.044+05','2023-01-26 14:58:58.044+05',NULL,NULL),
    (7,1,'2023-01-26 14:58:58.045+05','2023-01-26 14:58:58.045+05',NULL,NULL),
    (8,1,'2023-01-26 14:58:58.045+05','2023-01-26 14:58:58.045+05',NULL,NULL),
    (8,5,'2023-01-26 14:58:58.045+05','2023-01-26 14:58:58.045+05',NULL,NULL),
    (8,6,'2023-01-26 14:58:58.045+05','2023-01-26 14:58:58.045+05',NULL,NULL);
    INSERT INTO public."CovorcSection2Facilities" ("covorcSection",facilities,"createdAt","updatedAt","covorcSectionId","facilityId") VALUES
    (9,1,'2023-01-26 15:06:30.874+05','2023-01-26 15:06:30.874+05',NULL,NULL),
    (10,6,'2023-01-26 15:06:30.875+05','2023-01-26 15:06:30.875+05',NULL,NULL),
    (10,1,'2023-01-26 15:06:30.875+05','2023-01-26 15:06:30.875+05',NULL,NULL),
    (11,1,'2023-01-26 15:16:20.304+05','2023-01-26 15:16:20.304+05',NULL,NULL),
    (11,4,'2023-01-26 15:16:20.304+05','2023-01-26 15:16:20.304+05',NULL,NULL),
    (11,3,'2023-01-26 15:16:20.304+05','2023-01-26 15:16:20.304+05',NULL,NULL),
    (12,1,'2023-01-26 15:32:13.875+05','2023-01-26 15:32:13.875+05',NULL,NULL),
    (13,1,'2023-01-26 15:32:13.875+05','2023-01-26 15:32:13.875+05',NULL,NULL),
    (13,6,'2023-01-26 15:32:13.875+05','2023-01-26 15:32:13.875+05',NULL,NULL),
    (14,1,'2023-01-26 15:32:13.876+05','2023-01-26 15:32:13.876+05',NULL,NULL);
    INSERT INTO public."CovorcSection2Facilities" ("covorcSection",facilities,"createdAt","updatedAt","covorcSectionId","facilityId") VALUES
    (14,6,'2023-01-26 15:32:13.876+05','2023-01-26 15:32:13.876+05',NULL,NULL);
    `;
        const bookingsScript = `
    INSERT INTO public.bookings (price,hours,"countOfPeople","date","isArchived","createdAt","updatedAt","covorcSectionId","userId") VALUES
    (100,1,1,'2023-01-22 19:00:00+05',false,'2023-01-26 14:54:42.036+05','2023-01-26 14:54:42.036+05',1,1),
    (100,1,1,'2023-01-22 17:00:00+05',false,'2023-01-26 14:54:42.088+05','2023-01-26 14:54:42.088+05',1,1),
    (200,2,1,'2023-01-22 15:00:00+05',false,'2023-01-26 14:54:42.096+05','2023-01-26 14:54:42.096+05',1,1),
    (200,1,1,'2023-01-22 17:00:00+05',false,'2023-01-26 14:54:42.104+05','2023-01-26 14:54:42.104+05',1,2),
    (100,1,1,'2023-01-22 17:00:00+05',false,'2023-01-26 14:54:42.111+05','2023-01-26 14:54:42.111+05',1,3),
    (2000,4,5,'2023-01-22 13:00:00+05',false,'2023-01-26 14:54:42.118+05','2023-01-26 14:54:42.118+05',1,3),
    (100,12,5,'2023-01-23 08:00:00+05',false,'2023-01-26 14:54:42.13+05','2023-01-26 14:54:42.13+05',1,1);
    `;
        const covorcSectionPicturesScript = `
    INSERT INTO public.covorc_section_pictures ("path",filename,"createdAt","updatedAt","covorcSectionId") VALUES
    ('./static','Gh9eDNRnd-I.jpg','2023-01-26 14:58:58.043+05','2023-01-26 14:58:58.043+05',6),
    ('./static','S0D_Gi0k4AA.jpg','2023-01-26 14:58:58.043+05','2023-01-26 14:58:58.043+05',6),
    ('./static','XEGfC7dSSUE.jpg','2023-01-26 14:58:58.043+05','2023-01-26 14:58:58.043+05',7),
    ('./static','VUlcOxvf5R4.jpg','2023-01-26 14:58:58.043+05','2023-01-26 14:58:58.043+05',8),
    ('./static','2Nhjgxn2soQ.jpg','2023-01-26 15:06:30.873+05','2023-01-26 15:06:30.873+05',9),
    ('./static','nvwaeqNIML8.jpg','2023-01-26 15:06:30.874+05','2023-01-26 15:06:30.874+05',9),
    ('./static','U00RPegG3lY.jpg','2023-01-26 15:06:30.874+05','2023-01-26 15:06:30.874+05',10),
    ('./static','HdVp9k4E6WA.jpg','2023-01-26 15:16:20.303+05','2023-01-26 15:16:20.303+05',11),
    ('./static','SGhnPJOtGmQ.jpg','2023-01-26 15:16:20.303+05','2023-01-26 15:16:20.303+05',11),
    ('./static','n112tgoRaOo.jpg','2023-01-26 15:32:13.874+05','2023-01-26 15:32:13.874+05',12);
    INSERT INTO public.covorc_section_pictures ("path",filename,"createdAt","updatedAt","covorcSectionId") VALUES
    ('./static','IOYwYOG7ahI.jpg','2023-01-26 15:32:13.874+05','2023-01-26 15:32:13.874+05',13),
    ('./static','NAMsj6Ctpnk.jpg','2023-01-26 15:32:13.874+05','2023-01-26 15:32:13.874+05',14);
    `;
        const covorcSectionTypesScript = `
    INSERT INTO public.covorc_section_types (title,"createdAt","updatedAt") VALUES
    ('Open space','2023-01-26 14:54:41.777+05','2023-01-26 14:54:41.777+05'),
    ('Переговорная','2023-01-26 14:54:41.813+05','2023-01-26 14:54:41.813+05'),
    ('Аудитория','2023-01-26 14:54:41.817+05','2023-01-26 14:54:41.817+05');
    `;
        const covorcSectionsScript = `
    INSERT INTO public.covorc_sections (description,"placesCount",price,"isArchived","createdAt","updatedAt","covorcId","covorcSectionTypeId","sectionTypeId") VALUES
    ('Рабочий стол, кресло, мягкий диван',30,130,false,'2023-01-26 14:58:58.031+05','2023-01-26 14:58:58.031+05',3,NULL,3),
    ('Стол на 10 персон, TV с HDMI кабелем с ферритовыми кольцами, маркерная стена',10,700,false,'2023-01-26 14:58:58.031+05','2023-01-26 14:58:58.031+05',3,NULL,2),
    ('Стол на 10 персон, TV с HDMI кабелем с ферритовыми кольцами, маркерная стена, проектор с Wi-Fi и передачей экрана с iOS и Android, мини-колонки',30,1200,false,'2023-01-26 14:58:58.032+05','2023-01-26 14:58:58.032+05',3,NULL,2),
    ('В общей зоне есть различные рабочие места: диваны со столиками, столы с креслами.',30,160,false,'2023-01-26 15:06:30.867+05','2023-01-26 15:06:30.867+05',4,NULL,3),
    ('Круглый стол на 8 человек, TV с HDMI кабелем, маркерная доска',8,850,false,'2023-01-26 15:06:30.867+05','2023-01-26 15:06:30.867+05',4,NULL,2),
    ('В вашем распоряжении будет ваше личное рабочее место, а также скоростной Wi-Fi, доступ к кухне и кофейному аппарату',30,140,false,'2023-01-26 15:16:20.299+05','2023-01-26 15:16:20.299+05',5,NULL,3),
    ('Длинный стол на 8 человек',8,400,false,'2023-01-26 15:32:13.866+05','2023-01-26 15:32:13.866+05',6,NULL,2),
    ('Помещение на 10 персон. TV с HDMI кабелем, маркерная доска.',10,800,false,'2023-01-26 15:32:13.866+05','2023-01-26 15:32:13.866+05',6,NULL,2),
    ('Помещение на 40 персон. TV с HDMI кабелем, маркерная доска, проектор, микрофон, колонки, дополнительное оборудование предоставляется по запросу',40,2500,false,'2023-01-26 15:32:13.866+05','2023-01-26 15:32:13.866+05',6,NULL,3),
    ('секция с опенспейсом',5,100,false,'2023-01-26 14:54:41.946+05','2023-01-26 14:54:41.946+05',NULL,NULL,1);
    INSERT INTO public.covorc_sections (description,"placesCount",price,"isArchived","createdAt","updatedAt","covorcId","covorcSectionTypeId","sectionTypeId") VALUES
    ('переговорка местная',2,200,false,'2023-01-26 14:54:41.955+05','2023-01-26 14:54:41.955+05',NULL,NULL,2),
    ('элитный опенспайс',3,500,false,'2023-01-26 14:54:41.958+05','2023-01-26 14:54:41.958+05',NULL,NULL,1),
    ('элитная переговорка',18,800,false,'2023-01-26 14:54:41.965+05','2023-01-26 14:54:41.965+05',NULL,NULL,2),
    ('элитная переговорка',100,30000,false,'2023-01-26 14:54:42.029+05','2023-01-26 14:54:42.029+05',NULL,NULL,3);
    `;
        const covorcsScript = `
    INSERT INTO public.covorcs (title,description,"shortDescription",address,contacts,"isArchived","monWorkTime","tueWorkTime","wedWorkTime","thuWorkTime","friWorkTime","satWorkTime","sunWorkTime","createdAt","updatedAt","userId") VALUES
    ('FreePeople','Здесь посетителям доступны закрепленные и незакрепленные рабочие места, а также офисы для небольших команд. Оснащение зала включает всю необходимую технику и мебель','','Екатеринбург, улица Добролюбова, дом 16/2, 3й этаж','8-343-288‒79‒11',false,'09:00-22:00','09:00-22:00','09:00-22:00','09:00-22:00','09:00-22:00','09:00-22:00','09:00-22:00','2023-01-26 14:58:57.939+05','2023-01-26 14:58:57.939+05',1),
    ('Welcome','Welcome - уютный коворкинг в центре Екатеринбурга. Больше никаких дополнительных расходов на мебель, интернет, клининг и охрану. У нас комфортно работать и реализовывать новые проекты.','','Екатеринбург, улица Хохрякова, дом 72, 2 этаж','+7 (902) 738-29-10',false,'09:00-23:00','09:00-23:00','09:00-23:00','09:00-23:00','09:00-23:00','09:00-23:00','09:00-23:00','2023-01-26 15:06:30.77+05','2023-01-26 15:06:30.77+05',1),
    ('TechCity','В нашем коворкинге есть 2 огромных зала, в каждом есть рабочие зоны на любой вкус: круглые столы со стульями, отдельные рабочие столы, кресла и диваны. У нас в гостях вы можете спокойно погружаться в свои проекты в рабочей и приятной атмосфере','','Екатеринбург, улица Викулова, дом 32','+7 (912) 367-98-22',false,'07:00-21:00','07:00-21:00','07:00-21:00','07:00-21:00','07:00-21:00','07:00-21:00','07:00-21:00','2023-01-26 15:16:20.082+05','2023-01-26 15:16:20.082+05',1),
    ('Поговорим?','Мы предлагаем в аренду переговорные на любой вкус. У нас есть помещения на разное количество человек. Мы делаем всё, чтобы ваши бизнес-встречи проходили комфортно и продуктивно','','Екатеринбург, улица Декабристов, 14','+7 (903) 180-56-89',false,'08:00-20:00','08:00-20:00','08:00-20:00','08:00-20:00','08:00-20:00','08:00-20:00','08:00-20:00','2023-01-26 15:32:13.767+05','2023-01-26 15:32:13.767+05',1);
    `;
        const facilitesScript = `
    INSERT INTO public.facilities (title,"createdAt","updatedAt") VALUES
    ('Wi-Fi','2023-01-26 14:54:41.82+05','2023-01-26 14:54:41.82+05'),
    ('Принтер','2023-01-26 14:54:41.828+05','2023-01-26 14:54:41.828+05'),
    ('кухня','2023-01-26 14:54:41.833+05','2023-01-26 14:54:41.833+05'),
    ('Чай, кофе','2023-01-26 14:54:41.835+05','2023-01-26 14:54:41.835+05'),
    ('ноутбук','2023-01-26 14:54:41.841+05','2023-01-26 14:54:41.841+05'),
    ('Проектор','2023-01-26 14:54:41.844+05','2023-01-26 14:54:41.844+05');
    `;
        const usersScript = `
    INSERT INTO public.users ("firstName","lastName",login,email,"phoneNumber","password","createdAt","updatedAt") VALUES
    (NULL,NULL,'user1','user1@mail.com','89999999999','$2b$10$kgXWKiqGxStsc/8OFELhbuI5tZu70mjvm010MOFqO87eP6ZSqMv1i','2023-01-26 14:54:41.849+05','2023-01-26 14:54:41.849+05'),
    (NULL,NULL,'user2','user2@mail.com','89999999999','$2b$10$kgXWKiqGxStsc/8OFELhbuI5tZu70mjvm010MOFqO87eP6ZSqMv1i','2023-01-26 14:54:41.853+05','2023-01-26 14:54:41.853+05'),
    (NULL,NULL,'user3','user3@mail.com','89999999999','$2b$10$kgXWKiqGxStsc/8OFELhbuI5tZu70mjvm010MOFqO87eP6ZSqMv1i','2023-01-26 14:54:41.858+05','2023-01-26 14:54:41.858+05');
    `;
        sequelize.query(covorcSectionTypesScript)
            .then(() => sequelize.query(facilitesScript))
            .then(() => sequelize.query(usersScript))
            .then(() => sequelize.query(covorcsScript))
            .then(() => sequelize.query(covorcSectionsScript))
            .then(() => sequelize.query(bookingsScript))
            .then(() => sequelize.query(covorcSectionPicturesScript))
            .then(() => sequelize.query(scriptCovorcSections2facilities))
            .then(() => sequelize.query(scriptBookingByHours));
        // initCovorcSectionTypes()
        //     .then(() => initFacilities())
        //     .then(() => initUsers())
        //     .then(() => initCovorcs())
        //     .then(() => initCovorcSections())
        //     .then(() => initBookings());
    });
}
function initCovorcSections() {
    return Covorc.findOne({ where: { title: "Супер-коворк" } }).then(covorc => {
        CovorcSection.findOrCreate({
            where: {
                covorcId: covorc.id,
                description: "секция с опенспейсом",
                sectionTypeId: 1,
                placesCount: 5,
                price: 100
            }
        }).then((covorcSection) => {
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 1 } });
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 2 } });
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 3 } });
        });
    }).then(() => Covorc.findOne({ where: { title: "Супер-коворк" } }).then(covorc => {
        CovorcSection.findOrCreate({
            where: {
                covorcId: covorc.id,
                description: "переговорка местная",
                sectionTypeId: 2,
                placesCount: 2,
                price: 200,
            }
        }).then((covorcSection) => {
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 1 } });
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 2 } });
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 3 } });
        });
    })).then(() => Covorc.findOne({ where: { title: "Супер-пупер коворкинг" } }).then(covorc => {
        CovorcSection.findOrCreate({
            where: {
                covorcId: covorc.id,
                description: "элитный опенспайс",
                sectionTypeId: 1,
                placesCount: 3,
                price: 500,
            }
        }).then((covorcSection) => {
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 1 } });
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 2 } });
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 3 } });
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 4 } });
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 5 } });
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 6 } });
        });
    })).then(() => Covorc.findOne({ where: { title: "Супер-пупер коворкинг" } }).then(covorc => {
        CovorcSection.findOrCreate({
            where: {
                covorcId: covorc.id,
                description: "элитная переговорка",
                sectionTypeId: 2,
                placesCount: 18,
                price: 800,
            }
        }).then((covorcSection) => {
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 1 } });
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 2 } });
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 3 } });
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 4 } });
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 5 } });
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 6 } });
        });
    })).then(() => Covorc.findOne({ where: { title: "Супер-пупер коворкинг" } }).then(covorc => {
        CovorcSection.findOrCreate({
            where: {
                covorcId: covorc.id,
                description: "элитная переговорка",
                sectionTypeId: 3,
                placesCount: 100,
                price: 30000,
            }
        }).then((covorcSection) => {
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 1 } });
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 2 } });
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 3 } });
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 4 } });
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 5 } });
            CovorcSection2Facilities.findOrCreate({ where: { covorcSection: covorcSection[0].id, facilities: 6 } });
        });
    }));
}
function initCovorcs() {
    return User.findOne({ where: { login: "user1" } }).then(user => {
        return Covorc.findOrCreate({
            where: {
                title: "Супер-коворк",
                description: "У нас вообще отличный коворкинг, придешь, уходить не зачхочешь, это невероятно, мы тут живем и всем советуем! Кофе, чай, печенье, все четко, электричество, вода, еда, все есть!",
                shortDescription: "У нас супер коворкинг, приходите!",
                monWorkTime: "10-21",
                tueWorkTime: "10-21",
                wedWorkTime: "10-21",
                thuWorkTime: "10-21",
                friWorkTime: "10-21",
                satWorkTime: "10-21",
                sunWorkTime: "10-21",
                address: "Екатеринбург, Мира, 32",
                contacts: "Тел 89213492131",
                userId: user.id,
            }
        });
    }).then(() => {
        return User.findOne({ where: { login: "user1" } }).then(user => {
            Covorc.findOrCreate({
                where: {
                    title: "Супер-пупер коворкинг",
                    description: "У нас вообще очень отличный коворкинг, лучший в мире, придешь, уходить не зачхочешь, это невероятно, мы тут живем и всем советуем! Кофе, чай, печенье, все четко, электричество, вода, еда, все есть!",
                    shortDescription: "У нас супер коворкинг, приходите!",
                    monWorkTime: "9-21",
                    tueWorkTime: "9-21",
                    wedWorkTime: "9-21",
                    thuWorkTime: "9-21",
                    friWorkTime: "9-21",
                    satWorkTime: "12-21",
                    sunWorkTime: "12-21",
                    address: "Екатеринбург, Мира, 19",
                    contacts: "Тел 8921349777",
                    userId: user.id,
                }
            });
        });
    });
}
function initUsers() {
    return User.findOrCreate({
        where: {
            login: 'user1',
            email: 'user1@mail.com',
            password: '$2b$10$kgXWKiqGxStsc/8OFELhbuI5tZu70mjvm010MOFqO87eP6ZSqMv1i',
            phoneNumber: '89999999999'
        } //password - 123
    }).then(() => User.findOrCreate({
        where: {
            login: 'user2',
            email: 'user2@mail.com',
            password: '$2b$10$kgXWKiqGxStsc/8OFELhbuI5tZu70mjvm010MOFqO87eP6ZSqMv1i',
            phoneNumber: '89999999999'
        }
    })).then(() => User.findOrCreate({
        where: {
            login: 'user3',
            email: 'user3@mail.com',
            password: '$2b$10$kgXWKiqGxStsc/8OFELhbuI5tZu70mjvm010MOFqO87eP6ZSqMv1i',
            phoneNumber: '89999999999'
        }
    }));
}
function initBookings() {
    Booking.findOrCreate({
        where: {
            price: 100,
            hours: 1,
            countOfPeople: 1,
            date: new Date('2023-01-22T19:00:00'),
            userId: 1,
            covorcSectionId: 1
        }
    }).then(() => BookingByHour.findOrCreate({
        where: {
            bookingId: 1,
            date: new Date('2023-01-22T19:00:00')
        }
    })).then(() => Booking.findOrCreate({
        where: {
            price: 100,
            hours: 1,
            countOfPeople: 1,
            date: new Date('2023-01-22T17:00:00'),
            userId: 1,
            covorcSectionId: 1
        }
    })).then(() => BookingByHour.findOrCreate({
        where: {
            bookingId: 2,
            date: new Date('2023-01-22T17:00:00')
        }
    })).then(() => Booking.findOrCreate({
        where: {
            price: 200,
            hours: 2,
            countOfPeople: 1,
            date: new Date('2023-01-22T15:00:00'),
            userId: 1,
            covorcSectionId: 1
        }
    })).then(() => {
        BookingByHour.findOrCreate({
            where: {
                bookingId: 3,
                date: new Date('2023-01-22T16:00:00')
            }
        });
        BookingByHour.findOrCreate({
            where: {
                bookingId: 1,
                date: new Date('2023-01-22T15:00:00')
            }
        });
    }).then(() => Booking.findOrCreate({
        where: {
            price: 200,
            hours: 1,
            countOfPeople: 1,
            date: new Date('2023-01-22T17:00:00'),
            userId: 2,
            covorcSectionId: 1
        }
    })).then(() => {
        BookingByHour.findOrCreate({
            where: {
                bookingId: 4,
                date: new Date('2023-01-22T17:00:00')
            }
        });
    }).then(() => Booking.findOrCreate({
        where: {
            price: 100,
            hours: 1,
            countOfPeople: 1,
            date: new Date('2023-01-22T17:00:00'),
            userId: 3,
            covorcSectionId: 1
        }
    })).then(() => {
        BookingByHour.findOrCreate({
            where: {
                bookingId: 5,
                date: new Date('2023-01-22T17:00:00')
            }
        });
    }).then(() => Booking.findOrCreate({
        where: {
            price: 2000,
            hours: 4,
            countOfPeople: 5,
            date: new Date('2023-01-22T13:00:00'),
            userId: 3,
            covorcSectionId: 1
        }
    })).then(() => {
        BookingByHour.findOrCreate({
            where: {
                bookingId: 6,
                date: new Date('2023-01-22T13:00:00')
            }
        });
        BookingByHour.findOrCreate({
            where: {
                bookingId: 6,
                date: new Date('2023-01-22T14:00:00')
            }
        });
        BookingByHour.findOrCreate({
            where: {
                bookingId: 6,
                date: new Date('2023-01-22T15:00:00')
            }
        });
        BookingByHour.findOrCreate({
            where: {
                bookingId: 6,
                date: new Date('2023-01-22T16:00:00')
            }
        });
    }).then(() => Booking.findOrCreate({
        where: {
            price: 100,
            hours: 12,
            countOfPeople: 5,
            date: new Date('2023-01-23T08:00:00'),
            userId: 1,
            covorcSectionId: 1
        }
    }).then(([booking, bool]) => {
        BookingByHour.findOrCreate({
            where: {
                bookingId: booking.id,
                date: new Date('2023-01-23T08:00:00')
            }
        });
        BookingByHour.findOrCreate({
            where: {
                bookingId: booking.id,
                date: new Date('2023-01-23T09:00:00')
            }
        });
        BookingByHour.findOrCreate({
            where: {
                bookingId: booking.id,
                date: new Date('2023-01-23T10:00:00')
            }
        });
        BookingByHour.findOrCreate({
            where: {
                bookingId: booking.id,
                date: new Date('2023-01-23T11:00:00')
            }
        });
        BookingByHour.findOrCreate({
            where: {
                bookingId: booking.id,
                date: new Date('2023-01-23T12:00:00')
            }
        });
        BookingByHour.findOrCreate({
            where: {
                bookingId: booking.id,
                date: new Date('2023-01-23T13:00:00')
            }
        });
        BookingByHour.findOrCreate({
            where: {
                bookingId: booking.id,
                date: new Date('2023-01-23T14:00:00')
            }
        });
        BookingByHour.findOrCreate({
            where: {
                bookingId: booking.id,
                date: new Date('2023-01-23T15:00:00')
            }
        });
        BookingByHour.findOrCreate({
            where: {
                bookingId: booking.id,
                date: new Date('2023-01-23T16:00:00')
            }
        });
        BookingByHour.findOrCreate({
            where: {
                bookingId: booking.id,
                date: new Date('2023-01-23T17:00:00')
            }
        });
        BookingByHour.findOrCreate({
            where: {
                bookingId: booking.id,
                date: new Date('2023-01-23T18:00:00')
            }
        });
        BookingByHour.findOrCreate({
            where: {
                bookingId: booking.id,
                date: new Date('2023-01-23T19:00:00')
            }
        });
    })).catch(ex => console.log(ex));
}
sequelize.sync({ alter: true, force: true }).catch((reason) => console.log(reason)).then(() => {
    logger.debug("All models were synchronized successfully.");
    //создание тестовых данных
    fillTestData().then(() => logger.debug("Test data successfully created."));
});
const app = createExpressServer({
    cors: true,
    controllers: [
        UserController,
        CovorcController,
        CovorcSectionController,
        BookingController,
        RolesController,
        TestController
    ]
});
//sync({ force: true})  This creates the table, dropping it first if it already existed
//.sync({ alter: true }) - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
// const loadJSON = (path) => JSON.parse(readFileSync(path).toString());
// const swaggerDocument = loadJSON("../swagger/openapi.json")
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(port, () => console.log(`Running on localhost:${process.env.PORT}`));
//# sourceMappingURL=index.js.map