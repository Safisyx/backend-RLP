"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
exports.secret = process.env.JWT_SECRET || '9u8nnjksfdt98*(&*%T$#hsfjk';
const ttl = 3600 * 4;
exports.sign = (data) => jwt.sign(data, exports.secret, { expiresIn: ttl });
exports.verify = (token) => jwt.verify(token, exports.secret);
exports.signup = (data) => jwt.sign(data, exports.secret, { expiresIn: 3600 * 24 });
exports.verifySignup = (token) => jwt.verify(token, exports.secret);
//# sourceMappingURL=jwt.js.map