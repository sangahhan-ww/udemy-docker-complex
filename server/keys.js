export default {
    redisConnection: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    },
    pgConnection: {
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT
    }
};