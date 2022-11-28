import { sequelize } from './dbconnection.js';
import { Model, DataTypes } from "sequelize";
import { Covorc } from "./Covorc.js";
import { CovorcSectionType } from "./CovorcSectionType.js";
import { Facilities } from "./Facilities.js";
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
    price: {
        type: DataTypes.INTEGER,
    },
    isArchived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
}, {
    sequelize,
    modelName: 'covorc_section'
});
Covorc.hasMany(CovorcSection);
CovorcSection.belongsTo(Covorc, { foreignKey: 'covorcId' });
CovorcSectionType.hasMany(CovorcSection);
CovorcSection.belongsTo(CovorcSectionType, { foreignKey: 'sectionTypeId' });
Facilities.belongsToMany(CovorcSection, { through: 'CovorcSection2Facilities', foreignKey: 'id' });
CovorcSection.belongsToMany(Facilities, { through: 'CovorcSection2Facilities', foreignKey: 'id' });
//# sourceMappingURL=CovorcSection.js.map