"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require("koa-multer");
exports.FILE_UPLOAD_OPTIONS = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/uploads');
        },
        filename: (req, file, cb) => {
            const extension = file.originalname.split('.').pop();
            cb(null, file.fieldname + '-' + new Date().toISOString().split('.')[0] + '.' + extension);
        }
    }),
    limits: {
        fieldNameSize: 255,
        fileSize: 1024 * 1024 * 2
    }
};
//# sourceMappingURL=fileUploadConfig.js.map