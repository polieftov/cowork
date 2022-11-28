import { sequelize } from './dbconnection.js';
import { Model, DataTypes } from "sequelize";
export class CovorcSectionType extends Model {
}
CovorcSectionType.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    sequelize,
    modelName: 'covorc_section_types'
});
export function initCovorcSectionTypes() {
    CovorcSectionType.findOrCreate({
        where: { title: 'Коворкинг' }
    });
    CovorcSectionType.findOrCreate({
        where: { title: 'Переговорная' }
    });
    CovorcSectionType.findOrCreate({
        where: { title: 'Аудитория' }
    });
}
//# sourceMappingURL=CovorcSectionType.js.map