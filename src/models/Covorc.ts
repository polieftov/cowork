import {sequelize} from './dbconnection.js'
import {Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey} from "sequelize";
import {User} from "./User.js";
import {CovorcSection} from "./CovorcSection.js";

export class Covorc extends Model<InferAttributes<Covorc>, InferCreationAttributes<Covorc>> {
    declare id: CreationOptional<number>;
    declare title: string;
    declare description: string;
    declare shortDescription: string;
    declare schedule: string;
    declare address: string;
    declare contacts: string;
    declare ownerId: ForeignKey<User['id']>;
    declare isArchived: boolean;

    // timestamps!
    // createdAt can be undefined during creation
    declare createdAt: CreationOptional<Date>;
    // updatedAt can be undefined during creation
    declare updatedAt: CreationOptional<Date>;

    async getMaxPrice(): Promise<number> {
        return await CovorcSection.max('price', {
            where: {
                covorcId: this.id
            }
        })
    }

    async getMinPrice(): Promise<number> {
        return await CovorcSection.min('price', {
            where: {
                covorcId: this.id
            }
        })
    }
}

Covorc.init(
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
        description: {
            type: DataTypes.STRING,
        },
        schedule: {
            type: DataTypes.STRING,
        },
        shortDescription: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contacts: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isArchived: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        modelName: 'covorc'
    }
)

Covorc.belongsTo(User, {foreignKey: 'userId'})
User.hasMany(Covorc)