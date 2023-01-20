
import  express  from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors';

import postRouter from './routes/posts.js'
import userRouter from './routes/users.js'


import dotenv from 'dotenv'
const app = express();
dotenv.config();

app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

app.use('/posts', postRouter) //first parameter will set up the starting path for particular route(second parameter)
                   //every routes inside of the postRoute is gonna start with post(fisrt paramertet)
app.use('/user', userRouter)

// const CONNECTION_URL = "mongodb+srv://javascriptmastery:javascriptmastery123@cluster0.kaogb6y.mongodb.net/?retryWrites=true&w=majority"

const CONNECTION_URL = process.env.CONNECTION_URL
const PORT = process.env.PORT;
mongoose.connect(CONNECTION_URL, {useNewUrlParser: true , useUnifiedTopology: true})
.then(()=>{app.listen(PORT, ()=>{console.log(`server run on port: ${PORT} and connected to mongoose`)})})
.catch((error)=>{ console.error(error)})

mongoose.set('strictQuery', false);
// mongoose.set('useFindAndModify', false);
console.log(process.env.CONNECTION_URL)