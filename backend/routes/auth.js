const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Notification = require('../models/Notification');
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

let users = [];

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

function addLog(user1, user2, io) {
  const log = new Notification({
    date: new Date(),
    username: user1.username,
    message: user2.username + ' closed the connection with you.',
    checked: false,
  });
  console.log(log);
  log.save().then(result => {
    console.log('intra');
    Notification.find({username: user1.username}).then(notifications => {
      io.sockets.connected[user1.socket].emit("updatenotifications", notifications);
    });
  })
}

module.exports = function (io) {

  socketAuth(io, {
    authenticate: async (socket, data, callback) => {
      const {token} = data;

      try {
        const user = await verifyUser(token);
        let ok = false;
        if (users.length > 0)
          users.filter(function (obj) {
            if (obj.username === user.username) {
              console.log(`Socket ${socket.id} already logged.`);
              obj.socket = socket.id;
              ok = true;
            }
          });
        if (!ok) {
          socket.user = user;
          users.push({socket: socket.id, username: user.username, streaming: 0, conn: ''});
        }
        User.findOne({username: user.username}).then(user => {
          if (user) {
            user.online = true;
            user.save();
          }
        });
        // console.log(users);
        return callback(null, true);
      } catch (e) {
        console.log(`Socket ${socket.id} unauthorized.`);
        return callback({message: 'UNAUTHORIZED'});
      }
    },
    postAuthenticate: (socket) => {
      users.forEach(user => {
        if (user.socket == socket.id && user.streaming == 2) {
          io.sockets.connected[user.socket].emit("stream", user);
        }
      });
      console.log(`Socket ${socket.id} authenticated.`);
    },
    disconnect: (socket) => {
      users.filter(function (obj) {
        if (obj.socket === socket.id) {
          User.findOne({username: obj.username}).then(user => {
            if (user) {
              user.online = false;
              user.save();
              users.filter(function (obj) {
                if (obj.username === user.username && obj.streaming === 1) {
                  obj.streaming = 0;
                  obj.conn = '';
                }
                if (obj.conn === user.username && obj.streaming === 2) {
                  obj.streaming = 0;
                  obj.conn = '';
                  io.sockets.connected[obj.socket].emit("streamclose", obj);
                  addLog(obj,user, io);
                }
              });
              // users.splice(index,1);
            }
          });
        }
      });
      console.log(`Socket ${socket.id} disconnected.`);
    }
  });

  io.on('connection', socket => {

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

    socket.on('closestream', token => {
      let fetchedUser = jwt.decode(token, 'secret_this_should_be_longer');
      User.findOne({username: fetchedUser.username}).then(user => {
        if (user) {
          users.filter(function (obj) {
            if (obj.username === user.username && obj.streaming === 1) {
              obj.streaming = 0;
              obj.conn = '';
            }
            if (obj.conn === user.username && obj.streaming === 2) {
              obj.streaming = 0;
              obj.conn = '';
              io.sockets.connected[obj.socket].emit("streamclose", obj);
              addLog(obj,user, io);
            }
          });
          // users.splice(index,1);
        }
      });
    });

    socket.on('stream', data => {
      let fetchedUser = jwt.decode(data.token, 'secret_this_should_be_longer');
      // this information should come from your cache or database
      User.findOne({username: fetchedUser.username}).then(user => {

        if (!user) {
          return reject('USER_NOT_FOUND');
        }
        fetchedUser = user;
      });
      if (fetchedUser.username == data.user1) {
        users.map(user => {
          if (user.username == data.user2) {
            user.conn = data.user1;
            user.streaming = 2;
            io.sockets.connected[user.socket].emit("stream", user);
          }
          if (user.username == data.user1) {
            user.streaming = 1;
            user.conn = data.user2;
          }
        })
      }
    });
  });


  return router;
};

