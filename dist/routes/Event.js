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
var express_1 = require("express");
var services_1 = require("../services");
var router = express_1.Router();
router.get('/events', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var events, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, services_1.eventService.getEvents()];
            case 1:
                events = _a.sent();
                return [2, res.json(events)];
            case 2:
                e_1 = _a.sent();
                return [2, res.status(500).json({
                        message: 'Server Error'
                    })];
            case 3: return [2];
        }
    });
}); });
router.get('/events/:id', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var event_1, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, services_1.eventService.getEvent(+req.params.id)];
            case 1:
                event_1 = _a.sent();
                return [2, res.json(event_1)];
            case 2:
                e_2 = _a.sent();
                return [2, res.status(500).json({
                        message: 'Server Error'
                    })];
            case 3: return [2];
        }
    });
}); });
router.post('/events', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var event_2, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, services_1.eventService.createEvent(req.body)];
            case 1:
                event_2 = _a.sent();
                return [2, res.json(event_2)];
            case 2:
                e_3 = _a.sent();
                return [2, res.status(500).json({
                        message: 'Server Error'
                    })];
            case 3: return [2];
        }
    });
}); });
router.put('/events/:id', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var event_3, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, services_1.eventService.updateEvent(req.body)];
            case 1:
                event_3 = _a.sent();
                return [2, res.json(event_3)];
            case 2:
                e_4 = _a.sent();
                return [2, res.status(500).json({
                        message: 'Server Error'
                    })];
            case 3: return [2];
        }
    });
}); });
router.get('/events/:id/questions', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var questions, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, services_1.eventService.getEventQuestions(+req.params.id)];
            case 1:
                questions = _a.sent();
                return [2, res.json(questions)];
            case 2:
                e_5 = _a.sent();
                return [2, res.status(500).json({
                        message: 'Server Error'
                    })];
            case 3: return [2];
        }
    });
}); });
router.post('/events/:id/questions', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var question, e_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, services_1.eventService.createQuestion(req.body)];
            case 1:
                question = _a.sent();
                return [2, res.json(question)];
            case 2:
                e_6 = _a.sent();
                return [2, res.status(500).json({
                        message: 'Server Error'
                    })];
            case 3: return [2];
        }
    });
}); });
router.put('/events/:id/questions/:questionId', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var question, e_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, services_1.eventService.updateQuestion(req.body)];
            case 1:
                question = _a.sent();
                return [2, res.json(question)];
            case 2:
                e_7 = _a.sent();
                return [2, res.status(500).json({
                        message: 'Server Error'
                    })];
            case 3: return [2];
        }
    });
}); });
router.get('/events/:id/questions/:questionId/votes', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, questionId, score, e_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.params, id = _a.id, questionId = _a.questionId;
                return [4, services_1.eventService.getQuestionScore(+id, +questionId)];
            case 1:
                score = _b.sent();
                return [2, res.json(score)];
            case 2:
                e_8 = _b.sent();
                return [2, res.status(500).json({
                        message: 'Server Error'
                    })];
            case 3: return [2];
        }
    });
}); });
router.post('/events/:id/questions/:id/votes', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vote, e_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, services_1.eventService.createQuestionVote(req.body)];
            case 1:
                vote = _a.sent();
                return [2, res.json(vote)];
            case 2:
                e_9 = _a.sent();
                return [2, res.status(500).json({
                        message: 'Server Error'
                    })];
            case 3: return [2];
        }
    });
}); });
router.get('/events/:id/messages', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var messages, e_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, services_1.eventService.getEventMessages(+req.params.id)];
            case 1:
                messages = _a.sent();
                return [2, res.json(messages)];
            case 2:
                e_10 = _a.sent();
                return [2, res.status(500).json({
                        message: 'Server Error'
                    })];
            case 3: return [2];
        }
    });
}); });
router.post('/events/:id/messages', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var message, e_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, services_1.eventService.createEventMessage(req.body)];
            case 1:
                message = _a.sent();
                return [2, res.json(message)];
            case 2:
                e_11 = _a.sent();
                return [2, res.status(500).json({
                        message: 'Server Error'
                    })];
            case 3: return [2];
        }
    });
}); });
router.put('/events/:id/messages/:messageId', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var message, e_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, services_1.eventService.updateEventMessage(req.body)];
            case 1:
                message = _a.sent();
                return [2, res.json(message)];
            case 2:
                e_12 = _a.sent();
                return [2, res.status(500).json({
                        message: 'Server Error'
                    })];
            case 3: return [2];
        }
    });
}); });
router.delete('/events/:id/messages/:messageId', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var deleted, e_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, services_1.eventService.deleteEventMessage(+req.params.messageId)];
            case 1:
                deleted = _a.sent();
                return [2, res.json({ success: deleted })];
            case 2:
                e_13 = _a.sent();
                return [2, res.status(500).json({
                        message: 'Server Error'
                    })];
            case 3: return [2];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=Event.js.map