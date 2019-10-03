'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var Question = (function () {
    function Question(q) {
        this.id = q.id;
        this.eventId = q.eventId;
        this.userId = q.userId;
        this.text = q.text;
        this.hidden = q.hidden;
        this.stats = q.stats;
    }
    Question.from = function (q) {
        return new Question({
            id: q.id,
            eventId: q.event_id,
            userId: q.user_id,
            text: q.text,
            hidden: q.hidden,
            stats: q.stats
        });
    };
    return Question;
}());
exports.Question = Question;
//# sourceMappingURL=Question.js.map