'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var User = (function () {
    function User(user) {
        this.id = user.id;
        this.clientId = user.clientId;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.username = user.username;
        this.password = user.password;
        this.roles = user.roles || [];
        this.isDisabled = user.isDisabled;
        this.disabledComment = user.disabledComment;
    }
    User.from = function (u) {
        return new User({
            id: u.id,
            clientId: u.client_id,
            firstName: u.first_name,
            lastName: u.last_name,
            email: u.email,
            username: u.username,
            password: u.password,
            roles: u.roles,
            isDisabled: u.is_disabled,
            disabledComment: u.disabled_comment
        });
    };
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.js.map