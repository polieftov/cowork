import {sequelize} from './dbconnection.js'
import {CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {CovorcSection} from "./CovorcSection.js";

export class CovorcSectionsPictures extends Model<InferAttributes<CovorcSectionsPictures>, InferCreationAttributes<CovorcSectionsPictures>> {
    declare id: CreationOptional<number>;
    declare path: string;
    declare filename: string;
    declare covorcSectionId: ForeignKey<CovorcSection['id']>;
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
        filename: {
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
