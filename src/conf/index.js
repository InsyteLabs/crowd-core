'use strict';

module.exports = {
    PORT: 9876,
    pg: {
        host:     'localhost',
        user:     'brycejech',
        password: 't00R2109$1@',
        database: 'crowdcore',
        port:      5432,

        connectionTimeoutMillis: 0,     // No timeout, default
        idleTimeoutMillis:       10000, // 10 seconds, default
        max:                     50     // Max pool clients, default 10
    }
}