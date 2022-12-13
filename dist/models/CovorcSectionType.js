import { sequelize } from './dbconnection.js';
import { DataTypes, Model } from "sequelize";
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
    return CovorcSectionType.findOrCreate({
        where: { title: 'Коворкинг' }
    }).then(() => {
        CovorcSectionType.findOrCreate({
            where: { title: 'Переговорная' }
        });
        CovorcSectionType.findOrCreate({
            where: { title: 'Аудитория' }
        });
    });
}
//# sourceMappingURL=CovorcSectionType.js.map