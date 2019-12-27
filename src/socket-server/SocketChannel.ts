
import { SocketClient }   from './SocketClient';
import { ISocketMessage } from './interfaces';
import uuid = require('uuid');
import { MessageType } from '../constants';

export class SocketChannel{
    channelName: string;

    clients:  SocketClient[]   = [];
    messages: ISocketMessage[] = [];

    constructor(channelName: string){
        this.channelName = channelName;
    }

    sendMessage(socketMessage: ISocketMessage): void{
        this.messages.push(socketMessage);

        for(let i = 0, len = this.clients.length; i < len; i++){
            const client: SocketClient = this.clients[i];

            client.sendMessage(socketMessage);

            client.lastMessageId = socketMessage.id;
        }
    }

    notifySubscriberCountChange(): void{
        const message: ISocketMessage = {
            id:      uuid(),
            channel: this.channelName,
            type:    MessageType.SUBSCRIBER_COUNT_UPDATE,
            data: {
                count: this.getSubscriberCount()
            }
        }

        this.sendMessage(message);
    }

    addClient(client: SocketClient): void{
        this.clients.push(client);

        this.notifySubscriberCountChange();

        if(client.lastMessageId){
            const messageIndex: number = this.getMessageIndex(client.lastMessageId);
            
            const messagesToSend: ISocketMessage[] = ~messageIndex
                ? this.messages.slice(messageIndex + 1)
                : this.messages;

            for(let i = 0, len = messagesToSend.length; i < len; i++){
                const message: ISocketMessage = messagesToSend[i];

                client.sendMessage(message);

                client.lastMessageId = message.id;
            }
        }
    }

    removeClient(id: string): void{
        const idx = this.clients.findIndex(c => c.id === id);
        if(~idx){
            this.clients.splice(idx, 1);

            this.notifySubscriberCountChange();
        }
    }

    getClient(id: string): SocketClient|undefined{
        return this.clients.find(c => c.id === id);
    }

    getMessage(id: string): ISocketMessage|undefined{
        return this.messages.find(m => m.id === id);
    }

    getMessageIndex(id: string): number{
        return this.messages.findIndex(m => m.id === id);
    }

    getSubscriberCount(): number{
        return this.clients.length;
    }
}