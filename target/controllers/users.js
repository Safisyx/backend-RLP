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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const user_1 = require("../entities/user");
const company_1 = require("../entities/company");
const jwt_1 = require("../jwt");
const template_1 = require("../mail/template");
let UserController = class UserController {
    async signupUser(jwtSignup, { password }) {
        const { id, role, email } = jwt_1.verifySignup(jwtSignup);
        console.log(id, role, email);
        if (!id || !role || !email)
            throw new routing_controllers_1.BadRequestError('ERROR ERROR ERROR');
        const user = await user_1.User.findOneById(id);
        if (!user)
            throw new routing_controllers_1.NotFoundError('Deze gebruiker bestaat niet');
        console.log(password);
        await user.setPassword(password);
        await user.save();
        if (!await user.checkPassword(password))
            throw new routing_controllers_1.BadRequestError('Het wachtwoord is niet geldig');
        const jwt = jwt_1.sign({ id: user.id, role: user.role });
        return { jwt, id: user.id };
    }
    getUser(id, { role }) {
        if (role !== 'Internal')
            throw new routing_controllers_1.BadRequestError('You are not allowed to get this info');
        return user_1.User.findOneById(id);
    }
    async getCurrentUser(currentUser) {
        const user = await user_1.User.findOneById(currentUser.id);
        if (!user)
            throw new routing_controllers_1.NotFoundError('User not found');
        return user;
    }
    async patchUser(userId, currentUser, update) {
        if (currentUser.role !== 'Internal')
            throw new routing_controllers_1.BadRequestError('Unauthorized to edit user');
        const user = await user_1.User.findOneById(userId);
        if (!user)
            throw new routing_controllers_1.NotFoundError('User not found');
        const { password } = update, rest = __rest(update, ["password"]);
        await user_1.User.merge(user, rest).save();
        return user;
    }
    async allUsers({ role }) {
        if (role !== 'Internal')
            throw new routing_controllers_1.BadRequestError('Cannot see other users info');
        return user_1.User.find();
    }
    async createUser({ role }, companyId, user) {
        if (role !== 'Internal')
            throw new routing_controllers_1.BadRequestError('Cannot create user');
        const { password, companyName } = user, rest = __rest(user, ["password", "companyName"]);
        const company = await company_1.Company.findOneById(companyId);
        if (!company)
            throw new routing_controllers_1.NotFoundError('Company not found');
        const userToSend = await user_1.User.create(Object.assign({}, rest, { company, companyName: company.companyName })).save();
        const userRole = (!userToSend.role) ? 'External' : userToSend.role;
        const jwt = jwt_1.signup({ id: userToSend.id, role: userRole, email: userToSend.email });
        try {
            await template_1.sendSignUpMail(userToSend.email, jwt);
        }
        catch (err) {
            return { message: err.message };
        }
        return await company_1.Company.findOneById(companyId);
    }
    async sendPasswordReset({ email }) {
        const user = await user_1.User.findOne({ where: { email } });
        if (!user)
            throw new routing_controllers_1.NotFoundError('User not found');
        const jwt = jwt_1.signup({ id: user.id, role: user.role, email: user.email });
        try {
            await template_1.sendForgotPasswordMail(email, jwt);
        }
        catch (err) {
            return { message: err.message };
        }
        return { message: 'Successfully sent password reset link.' };
    }
    async removeUser(id, currentUser) {
        if (currentUser.role !== 'Internal')
            throw new routing_controllers_1.BadRequestError('Cannot delete other users');
        const user = await user_1.User.findOneById(id);
        if (!user)
            throw new routing_controllers_1.NotFoundError('Cannot find user');
        user.remove();
        return "user succesfully deleted";
    }
};
__decorate([
    routing_controllers_1.Patch('/signup/:jwtSignup'),
    __param(0, routing_controllers_1.Param('jwtSignup')),
    __param(1, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signupUser", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Get('/users/:id([0-9]+)'),
    __param(0, routing_controllers_1.Param('id')),
    __param(1, routing_controllers_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUser", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Get('/users/currentUser'),
    __param(0, routing_controllers_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getCurrentUser", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Patch('/users/:id'),
    __param(0, routing_controllers_1.Param('id')),
    __param(1, routing_controllers_1.CurrentUser()),
    __param(2, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "patchUser", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Get('/users'),
    __param(0, routing_controllers_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "allUsers", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Post('/users/company/:companyId'),
    __param(0, routing_controllers_1.CurrentUser()),
    __param(1, routing_controllers_1.Param('companyId')),
    __param(2, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    routing_controllers_1.Post('/forgotPassword'),
    __param(0, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "sendPasswordReset", null);
__decorate([
    routing_controllers_1.Authorized(),
    routing_controllers_1.Delete('/users/:id([0-9]+)'),
    __param(0, routing_controllers_1.Param('id')),
    __param(1, routing_controllers_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removeUser", null);
UserController = __decorate([
    routing_controllers_1.JsonController()
], UserController);
exports.default = UserController;
//# sourceMappingURL=users.js.map