'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var routes_1 = require("./routes");
var server = express_1.default();
server.set('case sensitive routing', true);
server.enable('trust proxy');
var jsonBody = body_parser_1.default.json(), urlBody = body_parser_1.default.urlencoded({ extended: true });
server.use(jsonBody, urlBody);
server.use(function (req, res, next) {
    res.removeHeader('X-Powered-By');
    res.header({
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    next();
});
server.get('/', function (req, res, next) {
    return res.send({ message: 'OK' });
});
server.use(routes_1.router);
server.listen(8080, function () {
    console.log('Server listening on 8080');
});
//# sourceMappingURL=index.js.map