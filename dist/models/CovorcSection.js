import { sequelize } from './dbconnection.js';
import { Model, DataTypes } from "sequelize";
export class CovorcSection extends Model {
}
CovorcSection.init({
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
}, {
    sequelize,
    modelName: 'covorc_section'
});
//# sourceMappingURL=CovorcSection.js.map