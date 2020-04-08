import keys from './keys';
import redis from 'redis';

const redisClient = redis.createClient({
    ...keys.redisConnection,
    retry_strategy: () => 1000 // try to reconnect every second
});

const sub = redisClient.duplicate();

const fib = (index) => {
    if (index < 2) return 1;
    return fib(index - 1) + fib (index - 2);
}

// whenever we get a new message, run the function we specify
sub.on('message', (channel, message) => {
    // insert hashset that key = message, value = fib value
    redisClient.hset('values', message, fib(parseInt(message)));
});

// whenever we insert a value into redis, we trigger the on
sub.subscribe('insert');