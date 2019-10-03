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
var services_1 = require("./services");
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var roles, rolesToCreate, i, len, role, users, usersToCreate, i, len, user, types, typesToCreate, i, len, type, clients, users_1, owner, clientsToCreate, i, len, client;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, services_1.userService.getRoles()];
            case 1:
                roles = _a.sent();
                if (!!roles.length) return [3, 6];
                console.log('DB has no roles, creating...');
                rolesToCreate = [
                    { name: 'admin' },
                    { name: 'sub-admin' },
                    { name: 'moderator' }
                ];
                i = 0, len = rolesToCreate.length;
                _a.label = 2;
            case 2:
                if (!(i < len)) return [3, 5];
                role = rolesToCreate[i];
                console.log("Creating role " + role.name);
                return [4, services_1.userService.createRole(role)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                i++;
                return [3, 2];
            case 5:
                console.log('Done creating roles');
                console.log(new Array(25).fill('-').join(''));
                _a.label = 6;
            case 6: return [4, services_1.userService.getUsers()];
            case 7:
                users = _a.sent();
                if (!!users.length) return [3, 12];
                console.log('DB has no users, creating...');
                usersToCreate = [
                    {
                        clientId: null,
                        firstName: 'Bryce',
                        lastName: 'Jech',
                        email: 'bryce@brycejech.com',
                        username: 'PyGuy',
                        password: 'myFakePa$$wor^d',
                        roles: [1]
                    },
                    {
                        clientId: null,
                        firstName: 'Laryn',
                        lastName: 'Jech',
                        email: 'laryn_burns@yahoo.com',
                        username: 'Laryolyn',
                        password: 'aSuperF4k$pass',
                        roles: [2, 3]
                    },
                    {
                        clientId: null,
                        firstName: 'Tracey',
                        lastName: 'Jech',
                        email: 'traceyjech@gmail.com',
                        username: 'Gammy',
                        password: 'theM0$stSecur%epass4Eva',
                        roles: [2, 3]
                    }
                ];
                i = 0, len = usersToCreate.length;
                _a.label = 8;
            case 8:
                if (!(i < len)) return [3, 11];
                user = usersToCreate[i];
                console.log("Creating user " + user.username);
                return [4, services_1.userService.createUser(user)];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10:
                i++;
                return [3, 8];
            case 11:
                console.log('Done creating users');
                console.log(new Array(25).fill('-').join(''));
                _a.label = 12;
            case 12: return [4, services_1.clientService.getTypes()];
            case 13:
                types = _a.sent();
                if (!!types.length) return [3, 18];
                console.log('DB has no account types, creating...');
                typesToCreate = [
                    { name: 'demo' },
                    { name: 'free' },
                    { name: 'pro' },
                    { name: 'elite' }
                ];
                i = 0, len = typesToCreate.length;
                _a.label = 14;
            case 14:
                if (!(i < len)) return [3, 17];
                type = typesToCreate[i];
                console.log("Creating type \"" + type.name + "\"");
                return [4, services_1.clientService.createType(type)];
            case 15:
                _a.sent();
                _a.label = 16;
            case 16:
                i++;
                return [3, 14];
            case 17:
                console.log('Done creating types');
                console.log(new Array(25).fill('-').join(''));
                _a.label = 18;
            case 18: return [4, services_1.clientService.getClients()];
            case 19:
                clients = _a.sent();
                if (!!clients.length) return [3, 25];
                console.log('DB has no clients, creating...');
                return [4, services_1.userService.getUsers()];
            case 20:
                users_1 = _a.sent();
                if (!users_1.length) {
                    throw new Error('No users to assign clients to');
                }
                owner = users_1[0];
                clientsToCreate = [
                    {
                        name: 'InsyteLabs',
                        slug: 'insyte-labs',
                        ownerId: owner.id,
                        types: [4]
                    }
                ];
                i = 0, len = clientsToCreate.length;
                _a.label = 21;
            case 21:
                if (!(i < len)) return [3, 24];
                client = clientsToCreate[i];
                console.log("Creating client " + client.name);
                return [4, services_1.clientService.createClient(client)];
            case 22:
                _a.sent();
                _a.label = 23;
            case 23:
                i++;
                return [3, 21];
            case 24:
                console.log('Done creating clients');
                console.log(new Array(25).fill('-').join(''));
                _a.label = 25;
            case 25: return [2];
        }
    });
}); })();
//# sourceMappingURL=db-seeder.js.map