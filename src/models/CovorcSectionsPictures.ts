import {sequelize} from './dbconnection.js'
import {Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes} from "sequelize";
import {CovorcSection} from "./CovorcSection.js";

export class CovorcSectionsPictures extends Model<InferAttributes<CovorcSectionsPictures>, InferCreationAttributes<CovorcSectionsPictures>> {
    declare id: CreationOptional<number>;
    declare path: number;

    // timestamps!
    // createdAt can be undefined during creation
    declare createdAt: CreationOptional<Date>;
    // updatedAt can be undefined during creation
    declare updatedAt: CreationOptional<Date>;
}


CovorcSectionsPictures.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        modelName: 'covorc_section_pictures'
    }
)
