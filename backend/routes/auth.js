const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const socketAuth = require('socketio-auth');

router.post('/register', (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: hash,
      type: 0,
      reviews: 0,
      rating: 0.0,
      name: req.body.name,
      online: false
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
  User.findOne({username: req.body.username}).then(user => {
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
      username: fetchedUser.username,
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
    User.findOne({username: fetchedUser.username}).then(user => {
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
    User.findOne({username: fetchedUser.username}).then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }
      return res.status(200).json({type: user.type});
    });
});

async function verifyUser(token) {
  return new Promise((resolve, reject) => {
    // setTimeout to mock a cache or database call
    setTimeout(() => {
      let fetchedUser = jwt.decode(token, 'secret_this_should_be_longer');
      // this information should come from your cache or database
      User.findOne({username: fetchedUser.username}).then(user => {
        if (!user) {
          return reject('USER_NOT_FOUND');
        }
        return resolve(user);
      });

    }, 200);
  });
}

let users = [];

module.exports = function (io) {

  socketAuth(io, {
    authenticate: async (socket, data, callback) => {
      const { token } = data;

      try {
        const user = await verifyUser(token);

        socket.user = user;

        return callback(null, true);
      } catch (e) {
        console.log(`Socket ${socket.id} unauthorized.`);
        return callback({ message: 'UNAUTHORIZED' });
      }
    },
    postAuthenticate: (socket) => {
      console.log(`Socket ${socket.id} authenticated.`);
    },
    disconnect: (socket) => {
      console.log(`Socket ${socket.id} disconnected.`);
    },
    auth: async (socket,data) => {
      console.log('test');
      User.findOne({username: data}).then(user => {
        if (user) {
          user.online = true;
          users.push(data);
          userName = data;
          io.emit(data);
          user.save();
        }
      });
    },

  disconnectNow: (socket,data) => {
    User.findOne({username: data}).then(user => {
      if (user) {
        user.online = false;
        users = users.filter(function (obj) {
          return obj !== data;
        });
        user.save();
      }
    });
    socket.disconnect();
    io.emit('user disconnected');
  },
});

  io.on('connection', socket => {
    var userName;
    // Socket event for gist created
    socket.on('auth', (data) => {
      User.findOne({username: data}).then(user => {
        if (user) {
          user.online = true;
          users.push(data);
          userName = data;
          io.emit(data);
          user.save();
        }
      });
    });

    socket.on('reconnect_attempt', () => {
      socket.io.opts.transports = ['polling', 'websocket'];
    });

    socket.on('disconnectNow', data => {
      User.findOne({username: data}).then(user => {
        if (user) {
          user.online = false;
          users = users.filter(function (obj) {
            return obj !== data;
          });
          user.save();
        }
      });
      socket.disconnect();
      io.emit('user disconnected');
    });

    socket.on('disconnect', function () {
      User.findOne({username: userName}).then(user => {
        if (user) {
          user.online = false;
          users = users.filter(function (obj) {
            return obj !== userName;
          });
          user.save();
        }
      });
      io.emit('user disconnected');
    });
  });


  return router;
};

