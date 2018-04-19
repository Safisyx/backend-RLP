"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const routing_controllers_1 = require("routing-controllers");
const db_1 = require("./db");
const jwt_1 = require("./jwt");
const Koa = require("koa");
const http_1 = require("http");
const IO = require("socket.io");
const socketIoJwtAuth = require("socketio-jwt-auth");
const jwt_2 = require("./jwt");
const order_1 = require("./controllers/order");
const delivery_1 = require("./controllers/delivery");
const login_1 = require("./controllers/login");
const users_1 = require("./controllers/users");
const message_1 = require("./controllers/message");
const photo_1 = require("./controllers/photo");
const user_1 = require("./entities/user");
const company_1 = require("./controllers/company");
const serve = require("koa-static");
const app = new Koa();
const server = new http_1.Server(app.callback());
exports.io = IO(server);
const port = process.env.PORT || 4001;
routing_controllers_1.useKoaServer(app, {
    cors: true,
    controllers: [
        order_1.default,
        delivery_1.default,
        login_1.default,
        users_1.default,
        message_1.default,
        company_1.default,
        photo_1.default,
    ],
    authorizationChecker: (action) => {
        const header = action.request.headers.authorization;
        if (header && header.startsWith('Bearer ')) {
            const [, token] = header.split(' ');
            try {
                return !!(token && jwt_1.verify(token));
            }
            catch (e) {
                throw new routing_controllers_1.BadRequestError(e);
            }
        }
        return false;
    },
    currentUserChecker: async (action) => {
        const header = action.request.headers.authorization;
        if (header && header.startsWith('Bearer ')) {
            const [, token] = header.split(' ');
            if (token) {
                const { id, role } = jwt_1.verify(token);
                return { id, role };
            }
        }
        return {};
    }
});
exports.io.use(socketIoJwtAuth.authenticate({ secret: jwt_2.secret }, async (payload, done) => {
    const user = await user_1.User.findOneById(payload.id);
    if (user)
        done(null, user);
    else
        done(null, false, `Invalid JWT user ID`);
}));
exports.io.on('connect', socket => {
    const user = socket.request.user;
    console.log(`User ${user.firstName} just connected`);
    let room;
    if (user.role === 'Internal')
        room = 'internalRoom';
    else
        room = `room${user.id}`;
    socket.join(room);
    console.log(`User ${user.firstName} joins room`, room);
    socket.on('room', room => {
        socket.join(room);
    });
    socket.on('leave', room => {
        socket.leave(room);
    });
    socket.on('disconnect', () => {
        socket.leave(room);
        console.log(`User ${user.firstName} just disconnected`);
    });
});
app.use(serve('./public'));
db_1.default()
    .then(_ => {
    server.listen(port);
    console.log(`Listening on port ${port}`);
})
    .catch(err => console.error(err));
//# sourceMappingURL=index.js.map