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
const user_1 = require("../entities/user");
const order_1 = require("../entities/order");
const message_1 = require("../entities/message");
const index_1 = require("../index");
let MessageController = class MessageController {
    async sendMessage(orderId, { message }, { id, role }) {
        const order = await order_1.Order.findOneById(orderId);
        if (!order)
            throw new routing_controllers_1.NotFoundError('Order not found');
        const user = await user_1.User.findOneById(id);
        if (!user)
            throw new routing_controllers_1.NotFoundError('User not found');
        if (role !== 'Internal' && id !== user.id)
            throw new routing_controllers_1.BadRequestError('Not allowed');
        await message_1.Message.create({ content: message, order, user, userName: user.firstName }).save();
        const updatedOrder = await order_1.Order.findOneById(orderId);
        if (!updatedOrder)
            throw new routing_controllers_1.NotFoundError('ERROR');
        const action = {
            type: 'ADD_MESSAGE',
            payload: updatedOrder
        };
        index_1.io.to('internalRoom').emit('action', action);
        index_1.io.to(`room${updatedOrder.userId}`).emit('action', action);
        return action.payload;
    }
};
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Post('/messages/:orderId'),
    __param(0, routing_controllers_1.Param('orderId')),
    __param(1, routing_controllers_1.Body()),
    __param(2, routing_controllers_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "sendMessage", null);
MessageController = __decorate([
    routing_controllers_1.JsonController()
], MessageController);
exports.default = MessageController;
//# sourceMappingURL=message.js.map