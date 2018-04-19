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
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const bcrypt = require("bcrypt");
const order_1 = require("./order");
const message_1 = require("./message");
const company_1 = require("./company");
let User = class User extends BaseEntity_1.BaseEntity {
    async setPassword(rawPassword) {
        const hash = await bcrypt.hash(rawPassword, 10);
        this.password = hash;
    }
    checkPassword(rawPassword) {
        return bcrypt.compare(rawPassword, this.password);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('text', { nullable: false }),
    __metadata("design:type", String)
], User.prototype, "companyName", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.MinLength(2),
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.MinLength(2),
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    class_validator_1.IsEmail(),
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.MinLength(8),
    typeorm_1.Column('text', { nullable: true }),
    class_transformer_1.Exclude({ toPlainOnly: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    class_validator_1.IsString(),
    typeorm_1.Column('text', { default: 'External' }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    class_validator_1.IsString(),
    typeorm_1.Column('text', { nullable: true }),
    __metadata("design:type", String)
], User.prototype, "telephoneNumber", void 0);
__decorate([
    typeorm_1.OneToMany(_ => order_1.Order, order => order.user, { eager: true }),
    __metadata("design:type", Array)
], User.prototype, "orders", void 0);
__decorate([
    typeorm_1.OneToMany(_ => message_1.Message, messages => messages.user),
    __metadata("design:type", Array)
], User.prototype, "messages", void 0);
__decorate([
    typeorm_1.ManyToOne(_ => company_1.Company, company => company.users),
    __metadata("design:type", company_1.Company)
], User.prototype, "company", void 0);
__decorate([
    typeorm_1.RelationId((user) => user.company),
    __metadata("design:type", Number)
], User.prototype, "companyId", void 0);
User = __decorate([
    typeorm_1.Entity()
], User);
exports.User = User;
//# sourceMappingURL=user.js.map