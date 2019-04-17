const express = require('express');

const app = express();

app.use('/api/posts',(req, res, next) => {
  const posts = [
    {id: 0, title: 'first title', content: 'first content'},
    {id: 1, title: 'second title', content: 'second content'},
    {id: 2, title: 'third title', content: 'third content'},
    {id: 3, title: 'forth title', content: 'forth content'},
  ];
  res.status(200).json(posts);
});

module.exports = app;
