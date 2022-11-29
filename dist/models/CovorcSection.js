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
export const CovorcSection2Facilities = sequelize.define('CovorcSection2Facilities', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    covorcSection: {
        type: DataTypes.INTEGER,
    },
    facilities: {
        type: DataTypes.INTEGER,
    }
});
Covorc.hasMany(CovorcSection);
CovorcSection.belongsTo(Covorc, { foreignKey: 'covorcId' });
CovorcSectionType.hasMany(CovorcSection);
CovorcSection.belongsTo(CovorcSectionType, { foreignKey: 'sectionTypeId' });
CovorcSection2Facilities.belongsTo(CovorcSection, { foreignKey: 'covorcSection' });
CovorcSection.hasMany(CovorcSection2Facilities);
CovorcSection2Facilities.belongsTo(Facilities, { foreignKey: 'facilities' });
Facilities.hasMany(CovorcSection2Facilities);
//# sourceMappingURL=CovorcSection.js.map