"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const order_1 = require("../entities/order");
const company_1 = require("../entities/company");
let CompanyController = class CompanyController {
    allCompanies() {
        return company_1.Company.find();
    }
    async getOrder(id, currentUser) {
        if (currentUser.id !== id)
            throw new routing_controllers_1.BadRequestError('U bent niet geautoriseerd om deze pagina te bekijken');
        const order = await order_1.Order.findOneById(id);
        if (!order)
            throw new routing_controllers_1.NotFoundError('Bestelling bestaat niet');
        return order;
    }
    async addCompany(company, { role }) {
        if (role !== 'Internal')
            throw new routing_controllers_1.BadRequestError('U bent niet geautoriseerd om een bedrijf toe te voegen');
        const ncompany = await company_1.Company.create(company).save();
        return await company_1.Company.findOneById(ncompany.id);
    }
};
__decorate([
    routing_controllers_1.Get("/companies"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "allCompanies", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Get('/companies/:id'),
    __param(0, routing_controllers_1.Param('id')),
    __param(1, routing_controllers_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "getOrder", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Post('/companies'),
    __param(0, routing_controllers_1.Body()),
    __param(1, routing_controllers_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "addCompany", null);
CompanyController = __decorate([
    routing_controllers_1.JsonController()
], CompanyController);
exports.default = CompanyController;
//# sourceMappingURL=company.js.map