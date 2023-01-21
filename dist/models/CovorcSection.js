import { sequelize } from './dbconnection.js';
import { Model, DataTypes } from "sequelize";
import { Covorc } from "./Covorc.js";
import { CovorcSectionType } from "./CovorcSectionType.js";
import { Facilities } from "./Facilities.js";
import { CovorcSectionsPictures } from "./CovorcSectionsPictures.js";
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
export const Covorc2CovorcSection = Covorc.hasMany(CovorcSection, { as: 'covorcSections' });
CovorcSection.belongsTo(Covorc, { foreignKey: 'covorcId' });
CovorcSectionType.hasMany(CovorcSection);
CovorcSection.belongsTo(CovorcSectionType, { foreignKey: 'sectionTypeId' });
CovorcSection2Facilities.belongsTo(CovorcSection, { foreignKey: 'covorcSection' });
CovorcSection.belongsToMany(Facilities, { through: CovorcSection2Facilities });
CovorcSection2Facilities.belongsTo(Facilities, { foreignKey: 'facilities' });
Facilities.belongsToMany(CovorcSection, { through: CovorcSection2Facilities });
CovorcSectionsPictures.belongsTo(CovorcSection, { foreignKey: "covorcSectionId" });
CovorcSection.hasMany(CovorcSectionsPictures);
//# sourceMappingURL=CovorcSection.js.map