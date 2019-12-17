'use strict';

import { IEventSettingPut } from "./IEventSettingPut";

export interface IEventPut{
    id:          number;
    clientId:    number;
    title:       string;
    slug:        string;
    description: string;
    startTime:   string;
    endTime:     string;

    settings?: IEventSettingPut;
}