import {sequelize} from './dbconnection.js'
import {Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey} from "sequelize";
import {Covorc} from "./Covorc";
import {CovorcSectionType} from "./CovorcSectionType";

export class CovorcSection extends Model<InferAttributes<CovorcSection>, InferCreationAttributes<CovorcSection>> {
    declare id: CreationOptional<number>
    declare covorcId: ForeignKey<Covorc['id']>
    declare description: string
    declare section_type: ForeignKey<CovorcSectionType['id']>
    declare placesCount: number
    declare isArchived: boolean

    // timestamps!
    // createdAt can be undefined during creation
    declare createdAt: CreationOptional<Date>;
    // updatedAt can be undefined during creation
    declare updatedAt: CreationOptional<Date>;
}


CovorcSection.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        description: {
            type: DataTypes.STRING,
        },
        placesCount: {
            type: DataTypes.INTEGER,
        },
        isArchived: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        modelName: 'covorc_section'
    }
)
