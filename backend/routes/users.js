const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

router.post('/myuser', (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: hash,
      type: 0,
      reviews: 0,
    });
    user.save().then(result => {
      res.status(201).json({
        message: 'User created!',
        result: result
      })
    })
      .catch(err => {
        res.status(500).json({
          error: err
        })
      });
  });
});

router.get('/myuser', checkAuth, (req, res, next) => {
  let fetchedUser = jwt.decode(req.get('Authorization').split(' ')[1], 'secret_this_should_be_longer');
  if (fetchedUser != null)
    User.findOne({username: fetchedUser.username}).then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }
      fetchedUser = user;
      return res.status(200).json({message: 'User found.', user: fetchedUser});
    });
});

router.get('/connections', checkAuth, (req, res, next) => {
  let fetchedUser = jwt.decode(req.get('Authorization').split(' ')[1], 'secret_this_should_be_longer');
  if (fetchedUser != null)
    User.find({online: true, username: {$ne: fetchedUser.username}}).then(connections => {
      return res.status(200).json({message: 'Connections found', connections: connections});
    });
  else
    return res.status(200).json({message: 'No connection available', connections: []});
});

module.exports = router;
