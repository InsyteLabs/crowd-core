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
var EventService = (function () {
    function EventService() {
    }
    EventService.prototype.getEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var events, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, db_1.db.q('get-events')];
                    case 1:
                        events = _a.sent();
                        return [2, events.map(function (e) { return models_1.Event.from(e); })];
                    case 2:
                        e_1 = _a.sent();
                        console.error('Failed to get events from database');
                        console.error(e_1);
                        return [2, []];
                    case 3: return [2];
                }
            });
        });
    };
    EventService.prototype.getClientEvents = function (clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var events, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, db_1.db.q('get-client-events', [clientId])];
                    case 1:
                        events = _a.sent();
                        return [2, events.map(function (e) { return models_1.Event.from(e); })];
                    case 2:
                        e_2 = _a.sent();
                        console.error("Failed to get events for client of ID " + clientId);
                        console.error(e_2);
                        return [2, []];
                    case 3: return [2];
                }
            });
        });
    };
    EventService.prototype.getEvent = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var event_1, questions, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, db_1.db.q('get-event', [id])];
                    case 1:
                        event_1 = _a.sent();
                        return [4, this.getEventQuestions(id)];
                    case 2:
                        questions = _a.sent();
                        event_1.questions = questions;
                        return [2, models_1.Event.from(event_1)];
                    case 3:
                        e_3 = _a.sent();
                        console.error('Failed to get event from database');
                        console.error(e_3);
                        return [2, new models_1.Event({})];
                    case 4: return [2];
                }
            });
        });
    };
    EventService.prototype.createEvent = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var args, event_2, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = [
                            event.clientId,
                            event.title,
                            event.slug || utilities_1.slugify(event.title),
                            event.description,
                            event.startTime,
                            event.endTime
                        ];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, db_1.db.q('create-event', args)];
                    case 2:
                        event_2 = _a.sent();
                        return [2, models_1.Event.from(event_2)];
                    case 3:
                        e_4 = _a.sent();
                        console.error("Failed to create event \"" + event.title + "\"");
                        console.error(e_4);
                        return [2, new models_1.Event({})];
                    case 4: return [2];
                }
            });
        });
    };
    EventService.prototype.updateEvent = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var args, event_3, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = [
                            event.id,
                            event.clientId,
                            event.title,
                            event.slug || utilities_1.slugify(event.title),
                            event.description,
                            event.startTime,
                            event.endTime
                        ];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, db_1.db.q('update-event', args)];
                    case 2:
                        event_3 = _a.sent();
                        return [2, models_1.Event.from(event_3)];
                    case 3:
                        e_5 = _a.sent();
                        console.error("Failed to update event \"" + event.title + "\"");
                        console.error(e_5);
                        return [2, new models_1.Event({})];
                    case 4: return [2];
                }
            });
        });
    };
    EventService.prototype.getQuestions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var questions, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, db_1.db.query('get-questions')];
                    case 1:
                        questions = _a.sent();
                        return [2, questions.map(function (q) { return models_1.Question.from(q); })];
                    case 2:
                        e_6 = _a.sent();
                        console.error('Failed to get questions from database');
                        console.error(e_6);
                        return [2, []];
                    case 3: return [2];
                }
            });
        });
    };
    EventService.prototype.getQuestion = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var question, stats, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, db_1.db.q('get-question', [id])];
                    case 1:
                        question = _a.sent();
                        return [4, this.getQuestionScore(question.eventId, id)];
                    case 2:
                        stats = _a.sent();
                        question.stats = stats;
                        return [2, models_1.Question.from(question)];
                    case 3:
                        e_7 = _a.sent();
                        console.error("Failed to get question of ID " + id + " from database");
                        console.error(e_7);
                        return [2, new models_1.Question({})];
                    case 4: return [2];
                }
            });
        });
    };
    EventService.prototype.getEventQuestions = function (eventId) {
        return __awaiter(this, void 0, void 0, function () {
            var questions, i, len, question, stats, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4, db_1.db.q('get-event-questions', [eventId])];
                    case 1:
                        questions = _a.sent();
                        i = 0, len = questions.length;
                        _a.label = 2;
                    case 2:
                        if (!(i < len)) return [3, 5];
                        question = questions[i];
                        return [4, this.getQuestionScore(eventId, question.id)];
                    case 3:
                        stats = _a.sent();
                        question.stats = stats;
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3, 2];
                    case 5: return [2, questions.map(function (q) { return models_1.Question.from(q); })];
                    case 6:
                        e_8 = _a.sent();
                        console.error("Failed to load quations for event of ID " + eventId);
                        console.error(e_8);
                        return [2, []];
                    case 7: return [2];
                }
            });
        });
    };
    EventService.prototype.createQuestion = function (q) {
        return __awaiter(this, void 0, void 0, function () {
            var args, question, e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = [
                            q.eventId,
                            q.userId,
                            q.text
                        ];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, db_1.db.q('create-question', args)];
                    case 2:
                        question = _a.sent();
                        return [2, models_1.Question.from(question)];
                    case 3:
                        e_9 = _a.sent();
                        console.error("Failed to create question for event of ID " + q.eventId);
                        console.error(e_9);
                        return [2, new models_1.Question({})];
                    case 4: return [2];
                }
            });
        });
    };
    EventService.prototype.updateQuestion = function (q) {
        return __awaiter(this, void 0, void 0, function () {
            var args, question, e_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = [
                            q.id,
                            q.eventId,
                            q.userId,
                            q.text,
                            q.hidden
                        ];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, db_1.db.q('update-question', args)];
                    case 2:
                        question = _a.sent();
                        return [2, models_1.Question.from(question)];
                    case 3:
                        e_10 = _a.sent();
                        console.error("Failed to update question for event of ID " + q.eventId);
                        console.error(e_10);
                        return [2, new models_1.Question({})];
                    case 4: return [2];
                }
            });
        });
    };
    EventService.prototype.getQuestionVoteByUser = function (questionId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var vote, e_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, db_1.db.q('get-question-vote-by-user', [questionId, userId])];
                    case 1:
                        vote = _a.sent();
                        return [2, models_1.Vote.from(vote)];
                    case 2:
                        e_11 = _a.sent();
                        console.error("Error fetching vote of questionId " + questionId + " and userId " + userId);
                        console.error(e_11);
                        return [2, models_1.Vote.from({})];
                    case 3: return [2];
                }
            });
        });
    };
    EventService.prototype.createQuestionVote = function (vote) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, e_12, e_13, args, vote_1, e_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.getQuestionVoteByUser(vote.questionId, vote.userId)];
                    case 1:
                        existing = _a.sent();
                        return [3, 3];
                    case 2:
                        e_12 = _a.sent();
                        console.error("Error fetching existing vote of questionId " + vote.questionId + " and userId " + vote.userId);
                        console.error(e_12);
                        return [2, models_1.Vote.from({})];
                    case 3:
                        if (!(existing && existing.id)) return [3, 7];
                        if (!(existing.value === vote.value)) return [3, 4];
                        return [2, existing];
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4, this.deleteVote(existing.id)];
                    case 5:
                        _a.sent();
                        return [3, 7];
                    case 6:
                        e_13 = _a.sent();
                        throw e_13;
                    case 7:
                        args = [
                            vote.eventId,
                            vote.questionId,
                            vote.userId,
                            vote.value
                        ];
                        _a.label = 8;
                    case 8:
                        _a.trys.push([8, 10, , 11]);
                        return [4, db_1.db.q('create-question-vote', args)];
                    case 9:
                        vote_1 = _a.sent();
                        return [2, models_1.Vote.from(vote_1)];
                    case 10:
                        e_14 = _a.sent();
                        console.error("Error creating vote of questionId " + vote.questionId + " and userId " + vote.userId);
                        console.error(e_14);
                        return [2, models_1.Vote.from({})];
                    case 11: return [2];
                }
            });
        });
    };
    EventService.prototype.deleteVote = function (voteId) {
        return __awaiter(this, void 0, void 0, function () {
            var deleted, e_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, db_1.db.q('delete-vote', [voteId])];
                    case 1:
                        deleted = _a.sent();
                        return [3, 3];
                    case 2:
                        e_15 = _a.sent();
                        console.error("Error deleting vote of ID " + voteId);
                        console.error(e_15);
                        throw e_15;
                    case 3: return [2];
                }
            });
        });
    };
    EventService.prototype.getQuestionScore = function (eventId, questionId) {
        return __awaiter(this, void 0, void 0, function () {
            var score, e_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, db_1.db.q('get-question-score', [eventId, questionId])];
                    case 1:
                        score = _a.sent();
                        return [2, score];
                    case 2:
                        e_16 = _a.sent();
                        console.error("Failed to get score for questionId " + questionId);
                        console.error(e_16);
                        return [2, {}];
                    case 3: return [2];
                }
            });
        });
    };
    EventService.prototype.getEventMessages = function (eventId) {
        return __awaiter(this, void 0, void 0, function () {
            var messages, e_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, db_1.db.q('get-event-messages', [eventId])];
                    case 1:
                        messages = _a.sent();
                        return [2, messages.map(function (m) { return models_1.Message.from(m); })];
                    case 2:
                        e_17 = _a.sent();
                        console.error("Failed to get messages for event of ID " + eventId);
                        console.error(e_17);
                        return [2, []];
                    case 3: return [2];
                }
            });
        });
    };
    EventService.prototype.createEventMessage = function (m) {
        return __awaiter(this, void 0, void 0, function () {
            var args, message, e_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = [
                            m.eventId,
                            m.userId,
                            m.text
                        ];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, db_1.db.q('create-event-message', args)];
                    case 2:
                        message = _a.sent();
                        return [2, models_1.Message.from(message)];
                    case 3:
                        e_18 = _a.sent();
                        console.error("Failed to create message for event of ID " + m.id);
                        console.error(e_18);
                        return [2, new models_1.Message({})];
                    case 4: return [2];
                }
            });
        });
    };
    EventService.prototype.updateEventMessage = function (m) {
        return __awaiter(this, void 0, void 0, function () {
            var args, message, e_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = [
                            m.id,
                            m.text,
                            m.hidden
                        ];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, db_1.db.q('update-event-message', args)];
                    case 2:
                        message = _a.sent();
                        return [2, models_1.Message.from(message)];
                    case 3:
                        e_19 = _a.sent();
                        console.error("Failed to update message of ID " + m.id);
                        console.error(e_19);
                        return [2, new models_1.Message({})];
                    case 4: return [2];
                }
            });
        });
    };
    EventService.prototype.deleteEventMessage = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var deleted, e_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, db_1.db.q('delete-event-message', [id])];
                    case 1:
                        deleted = _a.sent();
                        return [2, deleted ? true : false];
                    case 2:
                        e_20 = _a.sent();
                        console.error("Failed to delete message of ID " + id);
                        console.error(e_20);
                        return [2, false];
                    case 3: return [2];
                }
            });
        });
    };
    return EventService;
}());
exports.eventService = new EventService();
//# sourceMappingURL=event-service.js.map