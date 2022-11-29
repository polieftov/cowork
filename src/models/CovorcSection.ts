import {sequelize} from './dbconnection.js'
import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
    ForeignKey,
    Deferrable
} from "sequelize";
import {Covorc} from "./Covorc.js";
import {CovorcSectionType} from "./CovorcSectionType.js";
import {Facilities} from "./Facilities.js";

export class CovorcSection extends Model<InferAttributes<CovorcSection>, InferCreationAttributes<CovorcSection>> {
    declare id: CreationOptional<number>
    declare covorcId: ForeignKey<Covorc['id']>
    declare description: string
    declare sectionTypeId: ForeignKey<CovorcSectionType['id']>
    declare placesCount: number
    declare price: number
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
        price: {
            type: DataTypes.INTEGER,
        },
        isArchived: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    {
        sequelize,
        modelName: 'covorc_section'
    }
)

export const CovorcSection2Facilities = sequelize.define('CovorcSection2Facilities',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        covorcSection: {
            type: DataTypes.INTEGER,
        },
        facilities: {
            type: DataTypes.INTEGER,
        }
    }
)

Covorc.hasMany(CovorcSection);
CovorcSection.belongsTo(Covorc, {foreignKey: 'covorcId'});
CovorcSectionType.hasMany(CovorcSection);
CovorcSection.belongsTo(CovorcSectionType, {foreignKey: 'sectionTypeId'})
CovorcSection2Facilities.belongsTo(CovorcSection, {foreignKey: 'covorcSection'})
CovorcSection.hasMany(CovorcSection2Facilities)
CovorcSection2Facilities.belongsTo(Facilities, {foreignKey: 'facilities'})
Facilities.hasMany(CovorcSection2Facilities)
