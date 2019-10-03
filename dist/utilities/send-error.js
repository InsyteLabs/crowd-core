'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var isProd = process.env['NODE_ENV'] === 'production';
function sendError(res, err, message) {
    if (message === void 0) { message = 'Server Error'; }
    console.log(err);
    console.log(message);
    if (isProd) {
        return res.status(500).json({ message: message });
    }
    return res.status(500).json({
        message: message,
        err: err.message,
        stack: err.stack
    });
}
exports.sendError = sendError;
//# sourceMappingURL=send-error.js.map