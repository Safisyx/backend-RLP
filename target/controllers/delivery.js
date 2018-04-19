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
const delivery_1 = require("../entities/delivery");
let DeliveryController = class DeliveryController {
    async createDelivery({ deliveryType, condition }, { role }) {
        if (role !== 'Internal')
            throw new routing_controllers_1.BadRequestError('You are not allowed to do that');
        const delivery = await delivery_1.Delivery.create({ deliveryType, condition }).save();
        const entity = await delivery_1.Delivery.findOneById(delivery.id);
        if (!entity)
            throw new routing_controllers_1.NotFoundError('An error occured');
        return entity;
    }
    async getDeliveries() {
        const notSorted = await delivery_1.Delivery.find();
        return notSorted.sort((a, b) => {
            if (!b.id || !a.id)
                return -1;
            return a.id - b.id;
        });
    }
    async getDelivery(id) {
        const delivery = await delivery_1.Delivery.findOneById(id);
        if (!delivery)
            throw new routing_controllers_1.NotFoundError('No such delivery');
        return delivery;
    }
    async deleteDelivery(id, { role }) {
        if (role !== 'Internal')
            throw new routing_controllers_1.BadRequestError('You are not allowed to do that');
        const delivery = await delivery_1.Delivery.findOneById(id);
        if (!delivery)
            throw new routing_controllers_1.NotFoundError('No such delivery');
        delivery.remove();
        return {
            message: 'Successfully removed'
        };
    }
    async patchDelivery(id, { deliveryType, condition }, { role }) {
        if (role !== 'Internal')
            throw new routing_controllers_1.BadRequestError('You are not allowed to do that');
        const delivery = await delivery_1.Delivery.findOneById(id);
        if (!delivery)
            throw new routing_controllers_1.NotFoundError('No such delivery');
        if (deliveryType)
            delivery.deliveryType = deliveryType;
        if (condition)
            delivery.condition = condition;
        await delivery.save();
        return delivery;
    }
};
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Post('/deliveries'),
    routing_controllers_1.HttpCode(201),
    __param(0, routing_controllers_1.Body()),
    __param(1, routing_controllers_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "createDelivery", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Get('/deliveries'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getDeliveries", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Get('/deliveries/:id'),
    __param(0, routing_controllers_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getDelivery", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Delete('/deliveries/:id'),
    __param(0, routing_controllers_1.Param('id')),
    __param(1, routing_controllers_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "deleteDelivery", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Patch('/deliveries/:id'),
    __param(0, routing_controllers_1.Param('id')),
    __param(1, routing_controllers_1.Body()),
    __param(2, routing_controllers_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "patchDelivery", null);
DeliveryController = __decorate([
    routing_controllers_1.JsonController()
], DeliveryController);
exports.default = DeliveryController;
//# sourceMappingURL=delivery.js.map