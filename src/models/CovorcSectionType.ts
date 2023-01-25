import {sequelize} from './dbconnection.js'
import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";

export class CovorcSectionType extends Model<InferAttributes<CovorcSectionType>, InferCreationAttributes<CovorcSectionType>> {
    declare id: CreationOptional<number>;
    declare title: number;

    // timestamps!
    // createdAt can be undefined during creation
    declare createdAt: CreationOptional<Date>;
    // updatedAt can be undefined during creation
    declare updatedAt: CreationOptional<Date>;
}

CovorcSectionType.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        modelName: 'covorc_section_types'
    }
)

export function initCovorcSectionTypes() {
    return CovorcSectionType.findOrCreate({
        where: {title: 'Open space'}
    }).then(() => {
        CovorcSectionType.findOrCreate({
            where: {title: 'Переговорная'}
        });
        CovorcSectionType.findOrCreate({
            where: {title: 'Аудитория'}
        })
    });
}

