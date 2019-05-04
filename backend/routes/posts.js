const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const checkAuth = require('../middleware/check-auth');

router.post("", checkAuth, (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  res.status(201).json({
    message: 'Post added successfully'
  })
});

router.put("/:id", checkAuth, (req,res)=> {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}).then((result)=> {
    res.status(200).json({message: 'Post updated'});
  })
});

router.get('', checkAuth, (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json(documents);
  });
});

router.delete('/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(()=> {
    res.status(200).json({
      message: 'Post deleted successfully'
    })
  });
});


module.exports = router;

