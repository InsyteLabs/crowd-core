'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var Client = (function () {
    function Client(c) {
        this.id = c.id;
        this.name = c.name;
        this.slug = c.slug;
        this.ownerId = c.ownerId;
        this.types = c.types || [];
        this.isDisabled = c.isDisabled;
        this.disabledComment = c.disabledComment;
    }
    Client.from = function (c) {
        return new Client({
            id: c.id,
            name: c.name,
            slug: c.slug,
            ownerId: c.owner_id,
            types: c.types || [],
            isDisabled: c.is_disabled,
            disabledComment: c.disabled_comment
        });
    };
    return Client;
}());
exports.Client = Client;
//# sourceMappingURL=Client.js.map