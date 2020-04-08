import keys from './keys';

// express app reqs
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// postgres client reqs
import { Pool } from 'pg';

// redis client reqs
import redis from 'redis';

/***** end imports *****/

// express app setup
const app = express();
app.use(cors()); 
app.use(bodyParser.json());

// postgres client setup
// postgres database should have one table that essentially logs previously computed fibs
const pgClient = new Pool(keys.pgConnection);
pgClient.on('error', () => console.log('lost PG connection'));
pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(error => console.log(error));

// redis client setup
const redisClient = redis.createClient({
    ...keys.redisConnection,
    retry_strategy: () => 1000 // try to reconnect every second
});
const pub = redisClient.duplicate();

// route handlers
app.get('/', (req, res) => {
    res.send('Hello there');
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * from values');
    res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    }); // redis supports callbacks only
});

app.post('/values', async (req, res) => {
    const index = req.body.index;
    try {
        if (parseInt(index) > 40) {
            return res.status(422).send('Index too high');
        }
        redisClient.hset('values', index, 'Nothing yet!'); // not yet calculated 
        pub.publish('insert', index);
        pgClient.query('INSERT INTO values(number) VALUES($1)', [index]); // does this need to be parseInted?
        res.send({working: true});
    } catch (error) {
        console.error(error);
    }
});

const port = 5000
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});