'use strict';

export const MessageType = {
    CONNECTION_ACCEPTED: 'connection-accepted',
    
    // User Messages
    USER_CREATED: 'user-created',
    USER_UPDATED: 'user-updated',
    USER_DELETED: 'user-deleted',

    // Event Messages
    EVENT_CREATED: 'event-created',
    EVENT_UPDATED: 'event-updated',
    EVENT_DELETED: 'event-deleted',

    // Question Messages
    QUESTION_CREATED: 'question-created',
    QUESTION_UPDATED: 'question-updated',
    QUESTION_DELETED: 'question-deleted',

    // Message Messages
    MESSAGE_CREATED: 'message-created',
    MESSAGE_UPDATED: 'message-updated',
    MESSAGE_DELETED: 'message-deleted'
}