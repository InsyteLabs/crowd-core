'use strict';

function User(user){
    this.id              = user.id
    this.clientId        = user.client_id
    this.firstName       = user.first_name
    this.lastName        = user.last_name
    this.email           = user.email
    this.username        = user.username
    this.password        = user.password
    this.isDisabled      = user.is_disabled
    this.disabledComment = user.disabled_comment

    return this;
}

module.exports = User;