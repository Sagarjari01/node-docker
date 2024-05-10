const express = require('express');
const app = express();
const cors = require('cors');
const redis = require('redis');
const client = redis.createClient({url: 'redis://redis:6379'});
const session = require('express-session');
const RedisStore = require('connect-redis').default

const mongoose = require('mongoose');
const { MONGO_CONTAINER, MONGO_PORT, MONGO_DATABASE_NAME, SESSION_SECRET } = require('./config/config');
const node_env = process.env.NODE_ENV
const postRouter = require('./routes/postRoute');
const userRouter = require('./routes/userRoute');
const morgan = require('morgan');
const port = (node_env==="production" ? process.env.PROD_PORT:process.env.PORT) || 5000
console.log(port);
app.enable("trust proxy")
client.connect().catch(console.error)
app.use(session({
  store: new RedisStore({client: client}),
  secret: SESSION_SECRET, 
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, 
    httpOnly: true, 
    maxAge:  1000*60*60, // Session cookie expiration time (milliseconds)
  }
}));
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

const MONGO_URL = `mongodb://${MONGO_CONTAINER}:${MONGO_PORT}/${MONGO_DATABASE_NAME}`;
// const MONGO_URL = `mongodb://localhost:27017/mydb`;

app.get('/',()=>{
  res.send('<h1>Hello</h1>')
})

app.use("/api/v1/posts",postRouter)
app.use("/api/v1/users",userRouter)



// app.get('/', (req, res) => {
//   res.send('this is also working in dev');
// });

// app.post('/', (req, res) => {
//     res.send("no, thats good, this wodking ");
// })

// app.get('/getproducts', async (req, res) => {
//   try {
//     await client.connect();
//     const product = await client.get('products');

//     if (product !== null) {
//       return res.json(JSON.parse(product));
//     }
//     const response = await fetch('https://jsonplaceholder.typicode.com/posts');
//     const json = await response.json();

//     client.set('products', JSON.stringify(json), 'EX', 3600);

//     res.json(json);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   } finally {
//     // Close connection after request handling (optional)
//     await client.quit();
//   }
// });

// app.get('/getproducts/:id', (req, res) => {
//   const id = req.params.id;
//   fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
//   .then((response) => response.json())
//   .then((json) => res.send(json));
// })

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});

mongoose.connect(MONGO_URL)
.then(() => {console.log('connected to mongodb')})
.catch((error) => {console.log(error)})