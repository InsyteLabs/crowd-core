'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
exports.router = express_1.Router();
var Client_1 = __importDefault(require("./Client"));
var User_1 = __importDefault(require("./User"));
var Event_1 = __importDefault(require("./Event"));
exports.router.use(Client_1.default);
exports.router.use(User_1.default);
exports.router.use(Event_1.default);
//# sourceMappingURL=index.js.map