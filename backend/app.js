const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
const app = express();
mongoose.connect("mongodb+srv://haboks:SP6gpTHYEuBd2sk9@cluster0-qcgyi.mongodb.net/askme?retryWrites=true", {useNewUrlParser: true})
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(() => {
    console.log('Connection failed');
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
  next();
});

app.use('/api/auth',authRoutes);
app.use('/api/posts',postsRoutes);

module.exports = app;
