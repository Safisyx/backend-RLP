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
const photo_1 = require("../entities/photo");
const user_1 = require("../entities/user");
const index_1 = require("../index");
const fileUploadConfig_1 = require("../fileUploadConfig");
const baseUrl = process.env.BASE_URL || 'http://localhost:4001';
let PhotoController = class PhotoController {
    async addPhoto(orderId, { id, role }, file) {
        if (!file.path.match(/\.(jpg|jpeg|png|gif)$/))
            throw new routing_controllers_1.BadRequestError('Need an image');
        const order = await order_1.Order.findOneById(orderId);
        if (!order)
            throw new routing_controllers_1.NotFoundError('No such order');
        const user = await user_1.User.findOneById(id);
        if (!user)
            throw new routing_controllers_1.NotFoundError('User not found');
        if (role !== 'Internal' && id !== user.id)
            throw new routing_controllers_1.BadRequestError('Not allowed');
        await photo_1.Photo.create({
            link: baseUrl + file.path.substring(6, file.path.length),
            order
        }).save();
        const updatedOrder = await order_1.Order.findOneById(orderId);
        const action = {
            type: 'ADD_PHOTO',
            payload: updatedOrder
        };
        index_1.io.to('internalRoom').emit('action', action);
        index_1.io.to(`room${order.userId}`).emit('action', action);
        return action.payload;
    }
    async add(file) {
        if (!file.path.match(/\.(jpg|jpeg|png|gif)$/))
            throw new routing_controllers_1.BadRequestError('Need an image');
        return await photo_1.Photo.create({
            link: baseUrl + file.path.substring(6, file.path.length)
        }).save();
    }
    async getPhotos(orderId) {
        const order = await order_1.Order.findOneById(orderId);
        if (!order)
            throw new routing_controllers_1.NotFoundError('No such order');
        return await photo_1.Photo.find({ order });
    }
};
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Post('/photos/order/:orderId'),
    __param(0, routing_controllers_1.Param('orderId')),
    __param(1, routing_controllers_1.CurrentUser()),
    __param(2, routing_controllers_1.UploadedFile('photo', { options: fileUploadConfig_1.FILE_UPLOAD_OPTIONS })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "addPhoto", null);
__decorate([
    routing_controllers_1.Post('/photos'),
    __param(0, routing_controllers_1.UploadedFile('photo', { options: fileUploadConfig_1.FILE_UPLOAD_OPTIONS })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "add", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Get('/photos/order/:orderId'),
    __param(0, routing_controllers_1.Param('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "getPhotos", null);
PhotoController = __decorate([
    routing_controllers_1.JsonController()
], PhotoController);
exports.default = PhotoController;
//# sourceMappingURL=photo.js.map