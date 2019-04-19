const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.use((req,res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
  next();
});

app.post("/api/post", (req,res,next)=> {
  const posts = req.body;
  res.status(201).json({
    message: 'Post added successfully'
  })
});

app.get('/api/posts',(req, res, next) => {
  const posts = [
    {id: 0, title: 'first title', content: 'first content'},
    {id: 1, title: 'second title', content: 'second content'},
    {id: 2, title: 'third title', content: 'third content'},
    {id: 3, title: 'forth title', content: 'forth content'},
  ];
  res.status(200).json(posts);
});

module.exports = app;
