import {sequelize} from './dbconnection.js'
import {Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes} from "sequelize";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare firstName: string;
    declare lastName: string;
    declare login: string;
    declare phoneNumber: string;
    declare password: string;

    // timestamps!
    // createdAt can be undefined during creation
    declare createdAt: CreationOptional<Date>;
    // updatedAt can be undefined during creation
    declare updatedAt: CreationOptional<Date>;
}


User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        modelName: 'users'
    }
)
