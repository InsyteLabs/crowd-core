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
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("../db");
var models_1 = require("../models");
var utilities_1 = require("../utilities");
var ClientService = (function () {
    function ClientService() {
    }
    ClientService.prototype.getClients = function () {
        return __awaiter(this, void 0, void 0, function () {
            var clients, i, len, client, clientTypes, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4, db_1.db.q('get-clients')];
                    case 1:
                        clients = _a.sent();
                        i = 0, len = clients.length;
                        _a.label = 2;
                    case 2:
                        if (!(i < len)) return [3, 5];
                        client = clients[i];
                        return [4, this.getClientTypes(client.id)];
                    case 3:
                        clientTypes = _a.sent();
                        client.types = clientTypes.map(function (t) { return t.name; });
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3, 2];
                    case 5: return [2, clients.map(function (c) { return models_1.Client.from(c); })];
                    case 6:
                        e_1 = _a.sent();
                        console.error('Failed to get clients from database');
                        console.error(e_1);
                        return [2, []];
                    case 7: return [2];
                }
            });
        });
    };
    ClientService.prototype.getClient = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var client, types, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, db_1.db.q('get-client', [id])];
                    case 1:
                        client = _a.sent();
                        return [4, this.getClientTypes(id)];
                    case 2:
                        types = _a.sent();
                        client.types = types.map(function (t) { return t.name; });
                        return [2, models_1.Client.from(client)];
                    case 3:
                        e_2 = _a.sent();
                        console.error("Failed to get client of ID \"" + id + "\"");
                        console.error(e_2);
                        return [2, new models_1.Client({})];
                    case 4: return [2];
                }
            });
        });
    };
    ClientService.prototype.getClientBySlug = function (slug) {
        return __awaiter(this, void 0, void 0, function () {
            var client, types, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, db_1.db.q('get-client-by-slug', [slug])];
                    case 1:
                        client = _a.sent();
                        return [4, this.getClientTypes(client.id)];
                    case 2:
                        types = _a.sent();
                        client.types = types.map(function (t) { return t.name; });
                        return [2, models_1.Client.from(client)];
                    case 3:
                        e_3 = _a.sent();
                        console.error("Failed to get client of slug " + slug);
                        console.error(e_3);
                        return [2, models_1.Client.from({})];
                    case 4: return [2];
                }
            });
        });
    };
    ClientService.prototype.createClient = function (newClient) {
        return __awaiter(this, void 0, void 0, function () {
            var args, client, e_4, types, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = [
                            newClient.name,
                            newClient.slug || utilities_1.slugify(newClient.name),
                            newClient.ownerId
                        ];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, db_1.db.q('create-client', args)];
                    case 2:
                        client = _a.sent();
                        return [3, 4];
                    case 3:
                        e_4 = _a.sent();
                        console.error('Error creating new client');
                        console.error(e_4);
                        return [2, new models_1.Client({})];
                    case 4:
                        if (!(newClient.types && newClient.types.length)) return [3, 8];
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4, this.updateClientTypes(client.id, newClient.types)];
                    case 6:
                        types = _a.sent();
                        return [3, 8];
                    case 7:
                        e_5 = _a.sent();
                        return [2, Promise.reject(e_5)];
                    case 8: return [2, this.getClient(client.id)];
                }
            });
        });
    };
    ClientService.prototype.updateClient = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            var curClient, e_6, prop, args, updated, e_7, types, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, db_1.db.q('get-client', [client.id])];
                    case 1:
                        curClient = _a.sent();
                        return [3, 3];
                    case 2:
                        e_6 = _a.sent();
                        return [2, Promise.reject('Failed to get client from database')];
                    case 3:
                        for (prop in client) {
                            if (client[prop] !== undefined) {
                                curClient[prop] = client[prop];
                            }
                        }
                        args = [
                            curClient.id,
                            curClient.name,
                            curClient.slug,
                            curClient.ownerId,
                            curClient.isDisabled,
                            curClient.disabledComment
                        ];
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4, db_1.db.q('update-client', args)];
                    case 5:
                        updated = _a.sent();
                        return [3, 7];
                    case 6:
                        e_7 = _a.sent();
                        console.error("Error updating client \"" + client.name + "\"");
                        console.error(e_7);
                        return [2, Promise.reject("Error updating client \"" + client.name + "\"")];
                    case 7:
                        if (!(client.types && client.types.length)) return [3, 11];
                        _a.label = 8;
                    case 8:
                        _a.trys.push([8, 10, , 11]);
                        return [4, this.updateClientTypes(updated.id, client.types)];
                    case 9:
                        types = _a.sent();
                        return [3, 11];
                    case 10:
                        e_8 = _a.sent();
                        return [2, Promise.reject(e_8)];
                    case 11: return [2, this.getClient(updated.id)];
                }
            });
        });
    };
    ClientService.prototype.disableClient = function (id, comment) {
        return __awaiter(this, void 0, void 0, function () {
            var client, e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.getClient(id)];
                    case 1:
                        client = _a.sent();
                        return [3, 3];
                    case 2:
                        e_9 = _a.sent();
                        return [2, Promise.reject(e_9)];
                    case 3:
                        client.isDisabled = true;
                        client.disabledComment = comment;
                        return [2, this.updateClient(client)];
                }
            });
        });
    };
    ClientService.prototype.enableClient = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var client, e_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.getClient(id)];
                    case 1:
                        client = _a.sent();
                        return [3, 3];
                    case 2:
                        e_10 = _a.sent();
                        return [2, Promise.reject(e_10)];
                    case 3:
                        client.isDisabled = false;
                        client.disabledComment = null;
                        return [2, this.updateClient(client)];
                }
            });
        });
    };
    ClientService.prototype.getTypes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var types, e_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, db_1.db.q('get-types')];
                    case 1:
                        types = _a.sent();
                        return [2, types];
                    case 2:
                        e_11 = _a.sent();
                        return [2, Promise.reject('Failed to get types from database')];
                    case 3: return [2];
                }
            });
        });
    };
    ClientService.prototype.getTypeIds = function () {
        return __awaiter(this, void 0, void 0, function () {
            var types, validTypes, e_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.getTypes()];
                    case 1:
                        types = _a.sent();
                        validTypes = types.reduce(function (acc, t) {
                            acc.push(t.id);
                            return acc;
                        }, []);
                        return [2, validTypes];
                    case 2:
                        e_12 = _a.sent();
                        return [2, Promise.reject(e_12)];
                    case 3: return [2];
                }
            });
        });
    };
    ClientService.prototype.getType = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var type, e_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, db_1.db.q('get-type', [id])];
                    case 1:
                        type = _a.sent();
                        return [2, type || { id: null, name: '' }];
                    case 2:
                        e_13 = _a.sent();
                        return [2, Promise.reject("Failed to get type \"" + id + "\" from database")];
                    case 3: return [2];
                }
            });
        });
    };
    ClientService.prototype.createType = function (newType) {
        return __awaiter(this, void 0, void 0, function () {
            var type, e_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, db_1.db.q('create-type', [newType.name])];
                    case 1:
                        type = _a.sent();
                        return [2, type];
                    case 2:
                        e_14 = _a.sent();
                        return [2, Promise.reject("Failed to create type \"" + newType.name + "\"")];
                    case 3: return [2];
                }
            });
        });
    };
    ClientService.prototype.updateType = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var curType, e_15, prop;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.getType(type.id)];
                    case 1:
                        curType = _a.sent();
                        return [3, 3];
                    case 2:
                        e_15 = _a.sent();
                        return [2, Promise.reject(e_15)];
                    case 3:
                        for (prop in type) {
                            if (type[prop] !== undefined) {
                                curType[prop] = type[prop];
                            }
                        }
                        return [2, db_1.db.q('update-type', [curType.id, curType.name])];
                }
            });
        });
    };
    ClientService.prototype.getClientTypes = function (clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var types, e_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, db_1.db.q('get-client-types', [clientId])];
                    case 1:
                        types = _a.sent();
                        return [2, types];
                    case 2:
                        e_16 = _a.sent();
                        console.error("Failed to get types for clientId \"" + clientId + "\"");
                        console.error(e_16);
                        return [2, []];
                    case 3: return [2];
                }
            });
        });
    };
    ClientService.prototype.updateClientTypes = function (clientId, types) {
        return __awaiter(this, void 0, void 0, function () {
            var validTypes, e_17, e_18, typesAdded, e_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.getTypeIds()];
                    case 1:
                        validTypes = _a.sent();
                        return [3, 3];
                    case 2:
                        e_17 = _a.sent();
                        return [2, Promise.reject(e_17)];
                    case 3:
                        types = types.filter(function (t) { return validTypes.includes(t); });
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4, this.dropClientTypes(clientId)];
                    case 5:
                        _a.sent();
                        return [3, 7];
                    case 6:
                        e_18 = _a.sent();
                        return [2, Promise.reject(e_18)];
                    case 7:
                        _a.trys.push([7, 9, , 10]);
                        return [4, this.addClientTypes(clientId, types)];
                    case 8:
                        typesAdded = _a.sent();
                        return [2, typesAdded];
                    case 9:
                        e_19 = _a.sent();
                        return [2, Promise.reject(e_19)];
                    case 10: return [2];
                }
            });
        });
    };
    ClientService.prototype.addClientTypes = function (clientId, types) {
        return __awaiter(this, void 0, void 0, function () {
            var insertedTypes, i, len, inserted, e_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        insertedTypes = [];
                        i = 0, len = types.length;
                        _a.label = 1;
                    case 1:
                        if (!(i < len)) return [3, 4];
                        return [4, db_1.db.q('add-client-type', [types[i], clientId])];
                    case 2:
                        inserted = _a.sent();
                        inserted && insertedTypes.push(inserted.type_id);
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3, 1];
                    case 4: return [2, insertedTypes];
                    case 5:
                        e_20 = _a.sent();
                        console.error('Error adding client types to database');
                        console.error(e_20);
                        return [2, []];
                    case 6: return [2];
                }
            });
        });
    };
    ClientService.prototype.removeClientTypes = function (clientId, types) {
        return __awaiter(this, void 0, void 0, function () {
            var deletedTypes, i, len, deleted, e_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        deletedTypes = [];
                        i = 0, len = types.length;
                        _a.label = 1;
                    case 1:
                        if (!(i < len)) return [3, 4];
                        return [4, db_1.db.q('remove-client-type', [types[i], clientId])];
                    case 2:
                        deleted = _a.sent();
                        deleted && deletedTypes.push(deleted.type_id);
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3, 1];
                    case 4: return [2, deletedTypes];
                    case 5:
                        e_21 = _a.sent();
                        console.error('Error deleting client types from database');
                        console.error(e_21);
                        return [2, []];
                    case 6: return [2];
                }
            });
        });
    };
    ClientService.prototype.dropClientTypes = function (clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var droppedTypes, e_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, db_1.db.q('drop-client-types', [clientId])];
                    case 1:
                        droppedTypes = _a.sent();
                        return [2, droppedTypes.reduce(function (acc, t) {
                                acc.push(t.type_id);
                                return acc;
                            }, [])];
                    case 2:
                        e_22 = _a.sent();
                        console.error("Failed to drop types for clientId: \"" + clientId + "\"");
                        console.error(e_22);
                        return [2, []];
                    case 3: return [2];
                }
            });
        });
    };
    return ClientService;
}());
exports.clientService = new ClientService();
//# sourceMappingURL=client-service.js.map