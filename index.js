import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv'

import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'

const app = express();
dotenv.config()

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/posts', postRoutes)
app.use('/users', userRoutes)

app.get('/', (req, res) => {
  res.send('Hello to memories API')
})

const CONNECTION_URL = 'mongodb+srv://Hieu:123@cluster0.xhllr.mongodb.net/postMessages?retryWrites=true&w=majority'
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(5000, () => console.log(`Server running on port ${5000}`));
  })
  .catch((err) => {
    console.log(err.message);
  });

