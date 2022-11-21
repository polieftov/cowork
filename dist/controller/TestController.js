var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Param } from 'routing-controllers';
import 'reflect-metadata';
let TestController = class TestController {
    getOne(id) {
        return 'This action returns test #' + id;
    }
    getAll() {
        return 'All tests';
    }
};
__decorate([
    Get('/tests/:id'),
    __param(0, Param('id'))
], TestController.prototype, "getOne", null);
__decorate([
    Get('/tests')
], TestController.prototype, "getAll", null);
TestController = __decorate([
    Controller()
], TestController);
export { TestController };
//# sourceMappingURL=TestController.js.map