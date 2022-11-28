import {sequelize} from './dbconnection.js'
import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
} from "sequelize";
import {CovorcSection} from "./CovorcSection.js";

export class Facilities extends Model<InferAttributes<Facilities>, InferCreationAttributes<Facilities>> {
    declare id: CreationOptional<number>
    declare title: string

    // timestamps!
    // createdAt can be undefined during creation
    declare createdAt: CreationOptional<Date>;
    // updatedAt can be undefined during creation
    declare updatedAt: CreationOptional<Date>;
}


Facilities.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        modelName: 'facilities'
    }
)

export function initFacilities() {
    Facilities.findOrCreate({
        where: {title: 'Wi-Fi'}
    });
    Facilities.findOrCreate({
        where: {title: 'Принтер'}
    });
    Facilities.findOrCreate({
        where: {title: 'Чай, кофе'}
    });
    Facilities.findOrCreate({
        where: {title: 'кухня'}
    });
    Facilities.findOrCreate({
        where: {title: 'ноутбук'}
    });
    Facilities.findOrCreate({
        where: {title: 'Проектор'}
    });
}

