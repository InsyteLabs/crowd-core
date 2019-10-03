'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var Vote = (function () {
    function Vote(v) {
        this.id = v.id;
        this.eventId = v.eventId;
        this.questionId = v.questionId;
        this.userId = v.userId;
        this.value = v.value;
    }
    Vote.from = function (v) {
        return new Vote({
            id: v.id,
            eventId: v.event_id,
            questionId: v.question_id,
            userId: v.user_id,
            value: v.value
        });
    };
    return Vote;
}());
exports.Vote = Vote;
//# sourceMappingURL=Vote.js.map