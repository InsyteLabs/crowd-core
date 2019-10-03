'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var Event = (function () {
    function Event(event) {
        this.id = event.id;
        this.clientId = event.clientId;
        this.title = event.title;
        this.slug = event.slug;
        this.description = event.description;
        this.startTime = new Date(event.startTime);
        this.endTime = new Date(event.endTime);
        this.active = event.active;
        this.questions = event.questions || [];
    }
    Event.from = function (event) {
        return new Event({
            id: event.id,
            clientId: event.client_id,
            title: event.title,
            slug: event.slug,
            description: event.description,
            startTime: new Date(event.start_time),
            endTime: new Date(event.end_time),
            active: event.is_active,
            questions: event.questions
        });
    };
    return Event;
}());
exports.Event = Event;
//# sourceMappingURL=Event.js.map