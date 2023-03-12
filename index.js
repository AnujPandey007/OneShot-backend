require('dotenv').config();

const userAuth = require('./routes/auth');
const userApi = require('./routes/user');
const blogApi = require('./routes/blog');

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

//main
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb+srv://anuj:anujpandey888@cluster0.rp2bx.mongodb.net/test");
  app.listen(port, () => {
      console.info(`Listening on port http://localhost:${port}`);
  });
}

//auth
app.use('/auth', userAuth);

//users 
app.use('/user', userApi);

//blogs
app.use('/blog', blogApi); 
