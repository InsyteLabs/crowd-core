'use strict';

import { IEventSettingPost } from "./IEventSettingPost";

export interface IEventPost{
    clientId:    number;
    title:       string;
    slug?:       string;
    description: string;
    startTime:   string;
    endTime:     string;

    settings?: IEventSettingPost;
}