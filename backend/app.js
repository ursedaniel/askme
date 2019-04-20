const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/post');
const app = express();
mongoose.connect("mongodb+srv://haboks:SP6gpTHYEuBd2sk9@cluster0-qcgyi.mongodb.net/askme?retryWrites=true", {useNewUrlParser: true})
  .then(()=> {
    console.log('Connected to DB');
  })
  .catch(()=> {
    console.log('Connection failed');
  });

app.use(bodyParser.json());

app.use((req,res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
  next();
});

//

app.post("/api/post", (req,res,next)=> {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  res.status(201).json({
    message: 'Post added successfully'
  })
});

app.get('/api/posts',(req, res, next) => {
  Post.find().then(documents => {
      res.status(200).json(documents);
    });
});

module.exports = app;
