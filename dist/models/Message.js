'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var Message = (function () {
    function Message(message) {
        this.id = message.id;
        this.eventId = message.eventId;
        this.userId = message.userId;
        this.text = message.text;
        this.hidden = message.hidden;
    }
    Message.from = function (m) {
        return new Message({
            id: m.id,
            eventId: m.event_id,
            userId: m.user_id,
            text: m.text,
            hidden: m.hidden
        });
    };
    return Message;
}());
exports.Message = Message;
//# sourceMappingURL=Message.js.map