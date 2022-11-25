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
    declare section_type: ForeignKey<CovorcSectionType['id']>
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
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        section_type: {
            type: DataTypes.INTEGER,
            references: {
                // This is a reference to another model
                model: CovorcSectionType,

                // This is the column name of the referenced model
                key: 'id',

                // With PostgreSQL, it is optionally possible to declare when to check the foreign key constraint, passing the Deferrable type.
                // deferrable: Deferrable.INITIALLY_IMMEDIATE
                // Options:
                // - `Deferrable.INITIALLY_IMMEDIATE` - Immediately check the foreign key constraints
                // - `Deferrable.INITIALLY_DEFERRED` - Defer all foreign key constraint check to the end of a transaction
                // - `Deferrable.NOT` - Don't defer the checks at all (default) - This won't allow you to dynamically change the rule in a transaction
            }
        },
        covorcId: {
            type: DataTypes.INTEGER,
            references: {
                // This is a reference to another model
                model: Covorc,

                // This is the column name of the referenced model
                key: 'id',

                // With PostgreSQL, it is optionally possible to declare when to check the foreign key constraint, passing the Deferrable type.
                // deferrable: Deferrable.INITIALLY_IMMEDIATE
                // Options:
                // - `Deferrable.INITIALLY_IMMEDIATE` - Immediately check the foreign key constraints
                // - `Deferrable.INITIALLY_DEFERRED` - Defer all foreign key constraint check to the end of a transaction
                // - `Deferrable.NOT` - Don't defer the checks at all (default) - This won't allow you to dynamically change the rule in a transaction
            }
        }
    },
    {
        sequelize,
        modelName: 'covorc_section'
    }
)


Facilities.belongsToMany(CovorcSection, { through: 'CovorcSection2Facilities' });
CovorcSection.belongsToMany(Facilities, { through: 'CovorcSection2Facilities' });
