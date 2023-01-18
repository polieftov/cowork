import { sequelize } from './dbconnection.js';
import { Model, DataTypes } from "sequelize";
import { User } from "./User.js";
export class Covorc extends Model {
}
Covorc.init({
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
}, {
    sequelize,
    modelName: 'covorc'
});
Covorc.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Covorc);
//# sourceMappingURL=Covorc.js.map