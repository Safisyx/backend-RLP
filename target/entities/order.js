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
const class_validator_1 = require("class-validator");
const delivery_1 = require("./delivery");
const user_1 = require("./user");
const address_1 = require("./address");
const message_1 = require("./message");
const photo_1 = require("./photo");
const company_1 = require("./company");
let Order = class Order extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Order.prototype, "id", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.MinLength(2),
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], Order.prototype, "shortDescription", void 0);
__decorate([
    class_validator_1.IsString(),
    typeorm_1.Column('text', { nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "description", void 0);
__decorate([
    class_validator_1.IsInt(),
    class_validator_1.Min(1),
    typeorm_1.Column('integer', { default: 1 }),
    __metadata("design:type", Number)
], Order.prototype, "amount", void 0);
__decorate([
    class_validator_1.IsDate(),
    typeorm_1.Column('date'),
    __metadata("design:type", Date)
], Order.prototype, "orderDate", void 0);
__decorate([
    class_validator_1.IsDate(),
    typeorm_1.Column('date', { nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "deliveryDate", void 0);
__decorate([
    class_validator_1.IsInt(),
    typeorm_1.Column('integer', { nullable: false }),
    __metadata("design:type", Number)
], Order.prototype, "orderNumber", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.MinLength(1),
    typeorm_1.Column('text', { nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "paymentType", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    typeorm_1.Column('boolean', { default: false }),
    __metadata("design:type", Boolean)
], Order.prototype, "archived", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    typeorm_1.Column('boolean', { default: false }),
    __metadata("design:type", Boolean)
], Order.prototype, "locked", void 0);
__decorate([
    typeorm_1.ManyToOne(_ => delivery_1.Delivery, delivery => delivery.orders),
    __metadata("design:type", delivery_1.Delivery)
], Order.prototype, "delivery", void 0);
__decorate([
    typeorm_1.RelationId((order) => order.delivery),
    __metadata("design:type", Number)
], Order.prototype, "deliveryId", void 0);
__decorate([
    typeorm_1.ManyToOne(_ => user_1.User, user => user.orders),
    __metadata("design:type", user_1.User)
], Order.prototype, "user", void 0);
__decorate([
    typeorm_1.RelationId((order) => order.user),
    __metadata("design:type", Number)
], Order.prototype, "userId", void 0);
__decorate([
    typeorm_1.OneToMany(_ => address_1.Address, addresses => addresses.order, { eager: true }),
    __metadata("design:type", Array)
], Order.prototype, "addresses", void 0);
__decorate([
    typeorm_1.OneToMany(_ => message_1.Message, message => message.order, { eager: true }),
    __metadata("design:type", Array)
], Order.prototype, "messages", void 0);
__decorate([
    typeorm_1.OneToMany(_ => photo_1.Photo, photos => photos.order, { eager: true }),
    __metadata("design:type", Array)
], Order.prototype, "photos", void 0);
__decorate([
    typeorm_1.ManyToOne(_ => company_1.Company, company => company.orders),
    __metadata("design:type", company_1.Company)
], Order.prototype, "company", void 0);
__decorate([
    typeorm_1.RelationId((order) => order.company),
    __metadata("design:type", Number)
], Order.prototype, "companyId", void 0);
__decorate([
    typeorm_1.Column('text', { nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "userEmail", void 0);
Order = __decorate([
    typeorm_1.Entity()
], Order);
exports.Order = Order;
//# sourceMappingURL=order.js.map