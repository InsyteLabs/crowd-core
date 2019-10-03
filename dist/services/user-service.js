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
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt = __importStar(require("bcrypt"));
var db_1 = require("../db");
var models_1 = require("../models");
var UserService = (function () {
    function UserService() {
        this.SALT_ROUNDS = 15;
    }
    UserService.prototype.getUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var users, i, len, user, roles, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4, db_1.db.q('get-users')];
                    case 1:
                        users = _a.sent();
                        i = 0, len = users.length;
                        _a.label = 2;
                    case 2:
                        if (!(i < len)) return [3, 5];
                        user = users[i];
                        return [4, this.getUserRoles(user.id)];
                    case 3:
                        roles = _a.sent();
                        user.roles = roles.map(function (r) { return r.name; });
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3, 2];
                    case 5: return [2, users.map(function (u) { return models_1.User.from(u); })];
                    case 6:
                        e_1 = _a.sent();
                        console.error('Failed to get users from database');
                        console.error(e_1);
                        return [2, []];
                    case 7: return [2];
                }
            });
        });
    };
    UserService.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user, roles, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, db_1.db.query('get-user', [id])];
                    case 1:
                        user = _a.sent();
                        return [4, this.getUserRoles(id)];
                    case 2:
                        roles = _a.sent();
                        user.roles = roles.map(function (r) { return r.name; });
                        return [2, models_1.User.from(user)];
                    case 3:
                        e_2 = _a.sent();
                        console.error("Failed to get user of ID \"" + id + "\"");
                        console.error(e_2);
                        return [2, new models_1.User({})];
                    case 4: return [2];
                }
            });
        });
    };
    UserService.prototype.getUserByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var user, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, db_1.db.q('get-user-by-username', [username])];
                    case 1:
                        user = _a.sent();
                        if (user) {
                            return [2, models_1.User.from(user)];
                        }
                        else {
                            return [2, models_1.User.from({})];
                        }
                        return [3, 3];
                    case 2:
                        e_3 = _a.sent();
                        console.error("Failed to get user of username " + username);
                        console.error(e_3);
                        return [2, models_1.User.from({})];
                    case 3: return [2];
                }
            });
        });
    };
    UserService.prototype.createUser = function (newUser) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var hash, e_4, args, user, e_5, roles, e_6;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4, this._hashPassword(newUser.password)];
                                case 1:
                                    hash = _a.sent();
                                    return [3, 3];
                                case 2:
                                    e_4 = _a.sent();
                                    console.log(e_4);
                                    return [2, reject('Password hashing error')];
                                case 3:
                                    args = [
                                        newUser.clientId || null,
                                        newUser.firstName,
                                        newUser.lastName,
                                        newUser.email,
                                        newUser.username,
                                        hash
                                    ];
                                    _a.label = 4;
                                case 4:
                                    _a.trys.push([4, 6, , 7]);
                                    return [4, db_1.db.query('create-user', args)];
                                case 5:
                                    user = _a.sent();
                                    return [3, 7];
                                case 6:
                                    e_5 = _a.sent();
                                    console.error(e_5);
                                    reject('Error saving user to database');
                                    return [3, 7];
                                case 7:
                                    if (!(newUser.roles && newUser.roles.length)) return [3, 11];
                                    _a.label = 8;
                                case 8:
                                    _a.trys.push([8, 10, , 11]);
                                    return [4, this.updateUserRoles(user.id, newUser.roles)];
                                case 9:
                                    roles = _a.sent();
                                    return [3, 11];
                                case 10:
                                    e_6 = _a.sent();
                                    return [2, reject(e_6)];
                                case 11: return [4, this.getUser(user.id)];
                                case 12:
                                    user = _a.sent();
                                    resolve(user);
                                    return [2];
                            }
                        });
                    }); })];
            });
        });
    };
    UserService.prototype.checkUserPassword = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, db_1.db.q('get-user-by-username', [username])];
                    case 1:
                        user = _a.sent();
                        return [3, 3];
                    case 2:
                        e_7 = _a.sent();
                        return [2, Promise.reject(false)];
                    case 3:
                        if (!user)
                            return [2, Promise.reject(false)];
                        return [2, this._checkPassword(password, user.password)];
                }
            });
        });
    };
    UserService.prototype.updateUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var curUser, e_8, prop, args, updated, e_9, roles, e_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.getUser(user.id)];
                    case 1:
                        curUser = _a.sent();
                        return [3, 3];
                    case 2:
                        e_8 = _a.sent();
                        return [2, Promise.reject(e_8)];
                    case 3:
                        for (prop in user) {
                            if (user[prop] !== undefined) {
                                curUser[prop] = user[prop];
                            }
                        }
                        args = [
                            curUser.id,
                            curUser.firstName,
                            curUser.lastName,
                            curUser.email,
                            curUser.username,
                            curUser.isDisabled,
                            curUser.disabledComment
                        ];
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4, db_1.db.q('update-user', args)];
                    case 5:
                        updated = _a.sent();
                        return [3, 7];
                    case 6:
                        e_9 = _a.sent();
                        console.error('Error updating user');
                        console.error(e_9);
                        return [2, Promise.reject('Failed to update user')];
                    case 7:
                        if (!(user.roles && user.roles.length)) return [3, 11];
                        _a.label = 8;
                    case 8:
                        _a.trys.push([8, 10, , 11]);
                        return [4, this.updateUserRoles(updated.id, user.roles)];
                    case 9:
                        roles = _a.sent();
                        return [3, 11];
                    case 10:
                        e_10 = _a.sent();
                        return [2, Promise.reject(e_10)];
                    case 11: return [2, this.getUser(updated.id)];
                }
            });
        });
    };
    UserService.prototype.setUserPassword = function (userId, password) {
        return __awaiter(this, void 0, void 0, function () {
            var hash, user, e_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._hashPassword(password)];
                    case 1:
                        hash = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4, db_1.db.q('update-user-password', [userId, hash])];
                    case 3:
                        user = _a.sent();
                        return [2, models_1.User.from(user)];
                    case 4:
                        e_11 = _a.sent();
                        console.error("Failed to update password for user of ID " + userId);
                        console.error(e_11);
                        return [2, new models_1.User({})];
                    case 5: return [2];
                }
            });
        });
    };
    UserService.prototype.disableUser = function (id, comment) {
        return __awaiter(this, void 0, void 0, function () {
            var user, e_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.getUser(id)];
                    case 1:
                        user = _a.sent();
                        return [3, 3];
                    case 2:
                        e_12 = _a.sent();
                        return [2, Promise.reject(e_12)];
                    case 3:
                        user.isDisabled = true;
                        user.disabledComment = comment;
                        return [2, this.updateUser(user)];
                }
            });
        });
    };
    UserService.prototype.enableUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user, e_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.getUser(id)];
                    case 1:
                        user = _a.sent();
                        return [3, 3];
                    case 2:
                        e_13 = _a.sent();
                        return [2, Promise.reject(e_13)];
                    case 3:
                        user.isDisabled = false;
                        user.disabledComment = null;
                        return [2, this.updateUser(user)];
                }
            });
        });
    };
    UserService.prototype.getRoles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, db_1.db.q('get-roles')];
                    case 1: return [2, _a.sent()];
                    case 2:
                        e_14 = _a.sent();
                        console.error('Failed to get roles from database');
                        console.error(e_14);
                        return [2, Promise.resolve([])];
                    case 3: return [2];
                }
            });
        });
    };
    UserService.prototype.getRoleIds = function () {
        return __awaiter(this, void 0, void 0, function () {
            var roles, validRoleIds, e_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.getRoles()];
                    case 1:
                        roles = _a.sent();
                        validRoleIds = roles.reduce(function (acc, r) {
                            acc.push(r.id);
                            return acc;
                        }, []);
                        return [2, validRoleIds];
                    case 2:
                        e_15 = _a.sent();
                        return [2, Promise.reject(e_15)];
                    case 3: return [2];
                }
            });
        });
    };
    UserService.prototype.getRole = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var e_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, db_1.db.q('get-role', [id])];
                    case 1: return [2, _a.sent()];
                    case 2:
                        e_16 = _a.sent();
                        console.error("Failed to get role \"" + id + "\" from database");
                        console.error(e_16);
                        return [2, Promise.resolve({ id: null, name: '' })];
                    case 3: return [2];
                }
            });
        });
    };
    UserService.prototype.createRole = function (role) {
        return __awaiter(this, void 0, void 0, function () {
            var e_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, db_1.db.q('create-role', [role.name])];
                    case 1: return [2, _a.sent()];
                    case 2:
                        e_17 = _a.sent();
                        console.error("Failed to create role \"" + role.name + "\"");
                        console.error(e_17);
                        return [2, Promise.reject({ id: null, name: '' })];
                    case 3: return [2];
                }
            });
        });
    };
    UserService.prototype.updateRole = function (role) {
        return __awaiter(this, void 0, void 0, function () {
            var curRole, e_18, prop;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.getRole(role.id)];
                    case 1:
                        curRole = _a.sent();
                        return [3, 3];
                    case 2:
                        e_18 = _a.sent();
                        return [2, Promise.reject(e_18)];
                    case 3:
                        for (prop in role) {
                            if (role[prop] !== undefined) {
                                curRole[prop] = role[prop];
                            }
                        }
                        return [2, db_1.db.q('update-role', [curRole.id, curRole.name])];
                }
            });
        });
    };
    UserService.prototype.getUserRoles = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var roles, e_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, db_1.db.query('get-user-roles', [userId])];
                    case 1:
                        roles = _a.sent();
                        return [2, roles];
                    case 2:
                        e_19 = _a.sent();
                        console.error("Failed to get roles for userID \"" + userId + "\"");
                        console.error(e_19);
                        return [2, []];
                    case 3: return [2];
                }
            });
        });
    };
    UserService.prototype.updateUserRoles = function (userId, roles) {
        return __awaiter(this, void 0, void 0, function () {
            var validRoles, e_20, e_21, rolesAdded, e_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.getRoleIds()];
                    case 1:
                        validRoles = _a.sent();
                        return [3, 3];
                    case 2:
                        e_20 = _a.sent();
                        return [2, Promise.reject(e_20)];
                    case 3:
                        roles = roles.filter(function (r) { return validRoles.includes(r); });
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4, this.dropUserRoles(userId)];
                    case 5:
                        _a.sent();
                        return [3, 7];
                    case 6:
                        e_21 = _a.sent();
                        return [2, Promise.reject(e_21)];
                    case 7:
                        _a.trys.push([7, 9, , 10]);
                        return [4, this.addUserRoles(userId, roles)];
                    case 8:
                        rolesAdded = _a.sent();
                        return [2, rolesAdded];
                    case 9:
                        e_22 = _a.sent();
                        return [2, Promise.reject(e_22)];
                    case 10: return [2];
                }
            });
        });
    };
    UserService.prototype.addUserRoles = function (userId, roles) {
        return __awaiter(this, void 0, void 0, function () {
            var insertedRoles, i, len, inserted, e_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        insertedRoles = [];
                        i = 0, len = roles.length;
                        _a.label = 1;
                    case 1:
                        if (!(i < len)) return [3, 4];
                        return [4, db_1.db.q('add-user-role', [roles[i], userId])];
                    case 2:
                        inserted = _a.sent();
                        inserted && insertedRoles.push(inserted.role_id);
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3, 1];
                    case 4: return [2, insertedRoles];
                    case 5:
                        e_23 = _a.sent();
                        console.error('Error adding user roles to database');
                        console.error(e_23);
                        return [2, []];
                    case 6: return [2];
                }
            });
        });
    };
    UserService.prototype.removeUserRoles = function (userId, roles) {
        return __awaiter(this, void 0, void 0, function () {
            var deletedRoles, i, len, deleted, e_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        deletedRoles = [];
                        i = 0, len = roles.length;
                        _a.label = 1;
                    case 1:
                        if (!(i < len)) return [3, 4];
                        return [4, db_1.db.q('remove-user-role', [roles[i], userId])];
                    case 2:
                        deleted = _a.sent();
                        deleted && deletedRoles.push(deleted.role_id);
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3, 1];
                    case 4: return [2, deletedRoles.filter(function (r) { return r; })];
                    case 5:
                        e_24 = _a.sent();
                        console.error('Error deleting user roles from database');
                        console.error(e_24);
                        return [2, []];
                    case 6: return [2];
                }
            });
        });
    };
    UserService.prototype.dropUserRoles = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var droppedRoles, e_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, db_1.db.q('drop-user-roles', [userId])];
                    case 1:
                        droppedRoles = _a.sent();
                        return [2, droppedRoles.reduce(function (acc, r) {
                                acc.push(r.role_id);
                                return acc;
                            }, [])];
                    case 2:
                        e_25 = _a.sent();
                        console.error("Failed to drop roles for userID \"" + userId + "\"");
                        console.error(e_25);
                        return [2, []];
                    case 3: return [2];
                }
            });
        });
    };
    UserService.prototype._hashPassword = function (password) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            bcrypt.hash(password, _this.SALT_ROUNDS, function (err, hash) { return err ? reject(err) : resolve(hash); });
        });
    };
    UserService.prototype._checkPassword = function (password, hash) {
        return new Promise(function (resolve, reject) {
            if (!(password && hash)) {
                return resolve(false);
            }
            bcrypt.compare(password, hash, function (err, result) { return resolve(err ? false : result); });
        });
    };
    return UserService;
}());
exports.userService = new UserService();
//# sourceMappingURL=user-service.js.map