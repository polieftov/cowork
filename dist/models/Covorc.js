var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { sequelize } from './dbconnection.js';
import { Model, DataTypes } from "sequelize";
import { CovorcSection } from "./CovorcSection.js";
export class Covorc extends Model {
    getMaxPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CovorcSection.max('price', {
                where: {
                    covorcId: this.id
                }
            });
        });
    }
    getMinPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CovorcSection.min('price', {
                where: {
                    covorcId: this.id
                }
            });
        });
    }
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
    schedule: {
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