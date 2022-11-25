import { sequelize } from './dbconnection.js';
import { Model, DataTypes } from "sequelize";
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    sequelize,
    modelName: 'covorc'
});
//# sourceMappingURL=Covorc.js.map