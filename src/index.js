import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import mysql from 'mysql2/promise';

const app = new Hono()

console.time('DB CONNECTION')
const connection = await mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'HONO_SERVER'
})
console.timeEnd('DB CONNECTION')

app.use('*',
  cors({
    origin: '*'
  })
)


app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/poker-night/get-users', async c => {
  console.time('GET USERS');

  const [results, fields] = await connection.query(`select *, concat(FIRST_NAME, ' ', LAST_NAME) as FULL_NAME
from poker_night`)

  console.log(results);
  console.timeEnd('GET USERS');

  return c.json(results)
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
