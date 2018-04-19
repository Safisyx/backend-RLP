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
const class_transformer_1 = require("class-transformer");
const user_1 = require("./user");
const order_1 = require("./order");
let Message = class Message extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Message.prototype, "id", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.MinLength(1),
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], Message.prototype, "content", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    typeorm_1.Column('boolean', { default: false }),
    __metadata("design:type", Boolean)
], Message.prototype, "read", void 0);
__decorate([
    class_transformer_1.Exclude(),
    typeorm_1.ManyToOne(_ => user_1.User, user => user.messages),
    __metadata("design:type", user_1.User)
], Message.prototype, "user", void 0);
__decorate([
    typeorm_1.RelationId((message) => message.user),
    __metadata("design:type", Number)
], Message.prototype, "userId", void 0);
__decorate([
    typeorm_1.ManyToOne(_ => order_1.Order, order => order.messages),
    class_transformer_1.Exclude(),
    __metadata("design:type", order_1.Order)
], Message.prototype, "order", void 0);
__decorate([
    typeorm_1.RelationId((message) => message.order),
    __metadata("design:type", Number)
], Message.prototype, "orderId", void 0);
__decorate([
    class_validator_1.IsString(),
    typeorm_1.Column('text', { nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "userName", void 0);
Message = __decorate([
    typeorm_1.Entity()
], Message);
exports.Message = Message;
//# sourceMappingURL=message.js.map