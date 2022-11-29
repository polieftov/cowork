import {sequelize} from './dbconnection.js'
import {Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey} from "sequelize";
import {User} from "./User.js";
import {CovorcSection} from "./CovorcSection.js";

export class Booking extends Model<InferAttributes<Booking>, InferCreationAttributes<Booking>> {
    declare id: CreationOptional<number>;
    declare price: number;
    declare hours: number;
    declare countOfPeoples: number;
    declare date: Date;
    declare userId: ForeignKey<User['id']>;
    declare covorcSectionId: ForeignKey<CovorcSection['id']>;
    declare isArchived: boolean;

    // timestamps!
    // createdAt can be undefined during creation
    declare createdAt: CreationOptional<Date>;
    // updatedAt can be undefined during creation
    declare updatedAt: CreationOptional<Date>;
}

Booking.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        hours: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        countOfPeoples: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
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
        modelName: 'booking'
    }
)

//user covorcsection
Booking.belongsTo(CovorcSection, {foreignKey: 'covorcSectionId'});
CovorcSection.hasMany(Booking);
Booking.belongsTo(User, {foreignKey: 'userId'});
User.hasMany(Booking);