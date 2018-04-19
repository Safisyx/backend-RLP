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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("typeorm/repository/BaseEntity");
const order_1 = require("./order");
const user_1 = require("./user");
let Company = class Company extends BaseEntity_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Company.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('text', { nullable: false }),
    __metadata("design:type", String)
], Company.prototype, "companyName", void 0);
__decorate([
    typeorm_1.Column('text', { nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "companyLogo", void 0);
__decorate([
    typeorm_1.OneToMany(_ => order_1.Order, order => order.company, { eager: true }),
    __metadata("design:type", Array)
], Company.prototype, "orders", void 0);
__decorate([
    typeorm_1.OneToMany(_ => user_1.User, user => user.company, { eager: true }),
    __metadata("design:type", Array)
], Company.prototype, "users", void 0);
Company = __decorate([
    typeorm_1.Entity({ name: 'company' })
], Company);
exports.Company = Company;
//# sourceMappingURL=company.js.map