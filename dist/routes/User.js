'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var jwt = __importStar(require("jsonwebtoken"));
var conf_1 = __importDefault(require("../conf"));
var constants_1 = require("../constants");
var services_1 = require("../services");
var utilities_1 = require("../utilities");
var router = express_1.Router();
router.get('/users', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var users, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, services_1.userService.getUsers()];
            case 1:
                users = _a.sent();
                return [2, res.json(users)];
            case 2:
                e_1 = _a.sent();
                return [2, res.status(500).json({ message: 'Server Error' })];
            case 3: return [2];
        }
    });
}); });
router.get('/users/:id', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, services_1.userService.getUser(+req.params.id)];
            case 1:
                user = _a.sent();
                return [2, res.json(user)];
            case 2:
                e_2 = _a.sent();
                return [2, res.status(500).json({ message: 'Server Error' })];
            case 3: return [2];
        }
    });
}); });
router.post('/users', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, services_1.userService.createUser(req.body)];
            case 1:
                user = _a.sent();
                return [2, res.json(user)];
            case 2:
                e_3 = _a.sent();
                return [2, utilities_1.sendError(res, e_3)];
            case 3: return [2];
        }
    });
}); });
router.post('/authenticate', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, user, valid, token, e_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                if (!(username && password)) {
                    return [2, res.status(400).json({
                            message: 'User and password fields required'
                        })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4, services_1.userService.getUserByUsername(username)];
            case 2:
                user = _b.sent();
                return [4, services_1.userService.checkUserPassword(username, password)];
            case 3:
                valid = _b.sent();
                if (!valid) {
                    return [2, res.status(400).json({
                            message: 'Incorrect username/password'
                        })];
                }
                return [4, jwt.sign({
                        issuer: 'CROWDCORE_API',
                        exp: Math.floor(Date.now() / 1000) + (constants_1.SECONDS_IN_DAY),
                        data: user
                    }, conf_1.default.SECRET)];
            case 4:
                token = _b.sent();
                return [2, res.json({ token: token })];
            case 5:
                e_4 = _b.sent();
                return [2, utilities_1.sendError(res, e_4)];
            case 6: return [2];
        }
    });
}); });
router.post('/users/:id/password', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, password, newPassword, user, valid, updated, e_5, e_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body, password = _a.password, newPassword = _a.newPassword;
                if (!(password && newPassword)) {
                    return [2, res.status(400).json({ message: '"password" and "newPassword" fields required' })];
                }
                return [4, services_1.userService.getUser(+req.params.id)];
            case 1:
                user = _b.sent();
                if (!(user && user.id)) {
                    return [2, res.status(404).json({
                            message: 'Not Found'
                        })];
                }
                return [4, services_1.userService.checkUserPassword(user.username, password)];
            case 2:
                valid = _b.sent();
                if (!valid) {
                    return [2, res.status(400).json({ message: 'Incorrect password' })];
                }
                _b.label = 3;
            case 3:
                _b.trys.push([3, 5, , 6]);
                return [4, services_1.userService.setUserPassword(user.id, newPassword)];
            case 4:
                updated = _b.sent();
                return [2, res.json(updated)];
            case 5:
                e_5 = _b.sent();
                return [2, res.status(500).json({
                        message: 'Server Error'
                    })];
            case 6: return [3, 8];
            case 7:
                e_6 = _b.sent();
                return [2, res.status(500).json({ message: 'Server Error' })];
            case 8: return [2];
        }
    });
}); });
router.put('/users/:id', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, e_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, services_1.userService.updateUser(req.body)];
            case 1:
                user = _a.sent();
                return [2, res.json(user)];
            case 2:
                e_7 = _a.sent();
                return [2, res.status(500).json({ message: 'Server Error' })];
            case 3: return [2];
        }
    });
}); });
router.get('/users/:id/disable', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, e_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, services_1.userService.disableUser(+req.params.id, 'Disabled via API')];
            case 1:
                user = _a.sent();
                return [2, res.json(user)];
            case 2:
                e_8 = _a.sent();
                return [2, res.status(500).json({ message: 'Server Error' })];
            case 3: return [2];
        }
    });
}); });
router.get('/users/:id/enable', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, e_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, services_1.userService.enableUser(+req.params.id)];
            case 1:
                user = _a.sent();
                return [2, res.json(user)];
            case 2:
                e_9 = _a.sent();
                return [2, res.status(500).json({ message: 'Server Error' })];
            case 3: return [2];
        }
    });
}); });
router.get('/roles', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var roles, e_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, services_1.userService.getRoles()];
            case 1:
                roles = _a.sent();
                return [2, res.json(roles)];
            case 2:
                e_10 = _a.sent();
                return [2, res.json({
                        message: 'Server Error'
                    })];
            case 3: return [2];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=User.js.map