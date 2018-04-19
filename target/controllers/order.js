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
const address_1 = require("../entities/address");
const delivery_1 = require("../entities/delivery");
const user_1 = require("../entities/user");
const photo_1 = require("../entities/photo");
const company_1 = require("../entities/company");
const fileUploadConfig_1 = require("../fileUploadConfig");
const baseUrl = process.env.BASE_URL || 'http://localhost:4001';
let OrderController = class OrderController {
    async createOrders(body, { id, role }, file) {
        const order = JSON.parse(body.order);
        const addresses = JSON.parse(body.addresses);
        if (role !== 'External')
            throw new routing_controllers_1.BadRequestError('Only client can create order');
        const user = await user_1.User.findOneById(id);
        if (!user)
            throw new routing_controllers_1.NotFoundError('User not found');
        const company = await company_1.Company.findOneById(user.companyId);
        if (!company)
            throw new routing_controllers_1.NotFoundError('Company not found');
        const userEmail = user.email;
        const date = order.orderDate || new Date();
        const delivery = await delivery_1.Delivery.findOneById(order.deliveryId);
        const entity = await order_1.Order.create(Object.assign({}, order, { orderDate: date, delivery, user, company, userEmail })).save();
        for (let i = 0; i < addresses.length; i++) {
            await address_1.Address.create(Object.assign({}, addresses[i], { order: entity })).save();
        }
        console.log(file ? true : false);
        if (file) {
            await photo_1.Photo.create({
                link: baseUrl + file.path.substring(6, file.path.length),
                order: entity
            }).save();
        }
        const orderToSend = await order_1.Order.findOneById(entity.id);
        if (!orderToSend)
            throw new routing_controllers_1.NotFoundError('An error occured');
        return orderToSend;
    }
    async getOrders({ id, role }) {
        if (role === 'Internal')
            return await order_1.Order.find();
        const user = await user_1.User.findOneById(id);
        if (!user)
            throw new routing_controllers_1.NotFoundError('User not found');
        const company = await company_1.Company.findOneById(user.companyId);
        return await order_1.Order.find({ where: { company: company } });
    }
    async getOrder(id, currentUser) {
        if (currentUser.id !== id)
            throw new routing_controllers_1.BadRequestError('You are not allowed to view that');
        const order = await order_1.Order.findOneById(id);
        if (!order)
            throw new routing_controllers_1.NotFoundError('No such order');
        return order;
    }
    async getNewNumber() {
        const orders = await order_1.Order.find();
        if (orders.length === 0)
            return {
                orderNumber: 10001
            };
        const sorted = orders.sort((a, b) => {
            console.log(typeof (a.orderNumber));
            if (a.orderNumber > b.orderNumber)
                return 1;
            return -1;
        });
        return {
            orderNumber: sorted[sorted.length - 1].orderNumber + 1
        };
    }
    async editOrder(id, currentUser, body) {
        if (currentUser.role !== 'Internal')
            throw new routing_controllers_1.BadRequestError('You are not allowed to do that');
        const order = await order_1.Order.findOneById(id);
        if (!order)
            throw new routing_controllers_1.NotFoundError('No such order');
        await order_1.Order.merge(order, body).save();
        return order;
    }
};
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Post('/orders'),
    routing_controllers_1.HttpCode(201),
    __param(0, routing_controllers_1.Body()),
    __param(1, routing_controllers_1.CurrentUser()),
    __param(2, routing_controllers_1.UploadedFile('photo', { options: fileUploadConfig_1.FILE_UPLOAD_OPTIONS })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "createOrders", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Get('/orders'),
    __param(0, routing_controllers_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrders", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Get('/orders/:id'),
    __param(0, routing_controllers_1.Param('id')),
    __param(1, routing_controllers_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrder", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Get('/orders/orderNumber/newNumber'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getNewNumber", null);
__decorate([
    routing_controllers_1.Authorized(),
    __param(0, routing_controllers_1.Param('id')),
    __param(1, routing_controllers_1.CurrentUser()),
    __param(2, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "editOrder", null);
OrderController = __decorate([
    routing_controllers_1.JsonController()
], OrderController);
exports.default = OrderController;
//# sourceMappingURL=order.js.map