const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

router.post('/register', (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      type: 0
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

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email}).then(user => {
    if (!user) {
      return res.status(401).json({
        message: 'Auth failed'
      })
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  }).then(result => {
    if (!result) {
      return res.status(401).json({
        message: 'Auth failed'
      })
    }
    const token = jwt.sign({
      email: fetchedUser.email,
      userId: fetchedUser._id
    }, 'secret_this_should_be_longer', {expiresIn: "1h"});
    res.status(200).json({token: token, expiresIn: 3600, type: fetchedUser.type});
  }).catch(err => {
    return res.status(401).json({
      message: 'Auth failed'
    })
  });

});

router.get('/type/update', checkAuth, (req, res, next) => {
  let fetchedUser = jwt.decode(req.get('Authorization').split(' ')[1], 'secret_this_should_be_longer');
  if (fetchedUser != null)
    User.findOne({email: fetchedUser.email}).then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }
      fetchedUser = user;
      fetchedUser.type = !fetchedUser.type;
      fetchedUser.save();
      return res.status(200).json({message: 'Changed user type', type: fetchedUser.type});
    });
});

router.get('/type', checkAuth, (req, res, next) => {
  let fetchedUser = jwt.decode(req.get('Authorization').split(' ')[1], 'secret_this_should_be_longer');
  if (fetchedUser != null)
    User.findOne({email: fetchedUser.email}).then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }
      return res.status(200).json({type: user.type});
    });
});

let users = [];

module.exports = function (io) {
  //Socket.IO
  io.on('connection', socket =>  {
    console.log('Socket connection ' + socket.id);
    var userEmail;
    // Socket event for gist created
    socket.on('login', (data) => {
      User.findOne({email: data}).then(user => {
        if (user) {
          user.online = true;
          user.save();
          users.push(data);
          userEmail = data;
          io.emit(data);
        }
      });
    });

    socket.on('disconnectNow', data => {
      User.findOne({email: data}).then(user => {
        if (user) {
          user.online = false;
          users = users.filter(function( obj ) {
            return obj !== data;
          });
          user.save();
        }
      });
      socket.disconnect();
      io.emit('user disconnected');
    });

    socket.on('disconnect', function () {
      User.findOne({email: userEmail}).then(user => {
        if (user) {
          user.online = false;
          users = users.filter(function( obj ) {
            return obj !== userEmail;
          });
          user.save();
        }
      });
      io.emit('user disconnected');
    });
  });
  return router;
};

