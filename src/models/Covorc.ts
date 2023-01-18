import {sequelize} from './dbconnection.js'
import {Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey} from "sequelize";
import {User} from "./User.js";
import {CovorcSection} from "./CovorcSection.js";

export class Covorc extends Model<InferAttributes<Covorc>, InferCreationAttributes<Covorc>> {
    declare id: CreationOptional<number>;
    declare title: string;
    declare description: string;
    declare shortDescription: string;
    declare address: string;
    declare contacts: string;
    declare userId: ForeignKey<User['id']>;
    declare isArchived: boolean;
    declare monWorkTime: string;
    declare tueWorkTime: string;
    declare wedWorkTime: string;
    declare thuWorkTime: string;
    declare friWorkTime: string;
    declare satWorkTime: string;
    declare sunWorkTime: string;

    // timestamps!
    // createdAt can be undefined during creation
    declare createdAt: CreationOptional<Date>;
    // updatedAt can be undefined during creation
    declare updatedAt: CreationOptional<Date>;

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
        monWorkTime: {
            type: DataTypes.STRING
        },
        tueWorkTime: {
            type: DataTypes.STRING
        },
        wedWorkTime: {
            type: DataTypes.STRING
        },
        thuWorkTime: {
            type: DataTypes.STRING
        },
        friWorkTime: {
            type: DataTypes.STRING
        },
        satWorkTime: {
            type: DataTypes.STRING
        },
        sunWorkTime: {
            type: DataTypes.STRING
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