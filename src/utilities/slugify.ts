'use strict';

export const slugify = (str: string): string => str.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');