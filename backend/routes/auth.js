const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Notification = require('../models/Notification');
const Log = require('../models/Log');
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
      price: 0,
      rating: 0.0,
      name: req.body.name,
      online: false,
      joinDate: new Date(),
      score: 0,
      responseTime: '0:00',
      dailyViews: 0
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

function addNotification(user1, user2, io, message) {
  const notification = new Notification({
    date: new Date(),
    username: user1.username,
    message: user2.username + message,
    checked: false,
  });
  notification.save().then(result => {
    Notification.find({username: user1.username}).sort({date: 'desc'}).then(notifications => {
      io.sockets.connected[user1.socket].emit("updatenotifications", notifications);
    });
  })
}

function addLog(data) {
  const log = new Log({
    dateStart: new Date(),
    dateEnd: new Date(),
    username1: data.user1,
    username2: data.user2,
    price: 0,
  });
  log.save().then(result => {
  });
}

function updateLog(type, user) {
  if (type == 1)
    Log.findOne({username1: user.username}).then(log => {
      console.log(log);
      // notificationNew = notification;
      // notificationNew.checked = !notificationNew.checked;
      // notificationNew.save();
      // res.status(201).json();
    });
  else {
    Log.findOne({username2: user.username}).then(log => {
      console.log(log);
      // notificationNew = notification;
      // notificationNew.checked = !notificationNew.checked;
      // notificationNew.save();
      // res.status(201).json();
    });
  }
}

function closeLog(data) {
  Log.find({username1: data.user1, username2: data.user2}).sort({dateStart: 'desc'}).then(logs => {
    var log = logs[0];
    log.dateEnd = new Date();
    User.findOne({username: data.user2}).then((user) => {
      var diffMs = (log.dateEnd - log.dateStart);
      var minutes = Math.ceil(diffMs / 60000);
      var seconds = ((diffMs % 60000) / 1000).toFixed(0);
      if (diffMs >= 60000) {
        log.price = minutes * user.price;
        log.duration = Math.floor(diffMs / 60000) + ':' + seconds;
      } else {
        log.price = user.price;
        log.duration = '0:' + seconds;
      }
      log.save().then(() => {
        Log.find({username2: data.user2}).then(logs => {
          let secondsNoMins = 0;
          logs.forEach(logNew => {
            secondsNoMins = secondsNoMins + Number(logNew.duration.split(':')[0]) * 60 + Number(logNew.duration.split(':')[1]);
          });
          let totalSeconds = secondsNoMins / logs.length;
          let responseTime = Math.floor(totalSeconds / 60) + ':' + Math.floor(totalSeconds % 60);
          user.responseTime = responseTime;
          user.save();
        });
      });
    })
  });
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
          users.push({socket: socket.id, username: user.username, streaming: 0, conn: '', price: user.price});
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
                  updateLog(obj.streaming, user);
                  obj.streaming = 0;
                  obj.conn = '';
                }
                if (obj.conn === user.username && obj.streaming === 2) {
                  updateLog(obj.streaming, user);
                  obj.streaming = 0;
                  obj.conn = '';
                  io.sockets.connected[obj.socket].emit("streamclose", obj);
                  addNotification(obj, user, io, ' has closed the connection.');
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
              addNotification(obj, user, io, ' has closed the connection.');
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
            user.question = data.question;
            user.categoryName = data.categoryName;
            io.sockets.connected[user.socket].emit("stream", user);
            addNotification({
              username: data.user2,
              socket: user.socket
            }, {username: data.user1}, io, ' wants to connect.');
          }
          if (user.username == data.user1) {
            user.streaming = 1;
            user.conn = data.user2;
            users.map(user2 => {
              if (user2.username == data.user2)
                user.price = user2.price;
            })
          }
        })
      } else {
        users.map(user => {
          if (user.username == data.user2 || user.username == data.user1) {
            io.sockets.connected[user.socket].emit("startstream", user);
            // addNotification({username: data.user2, socket: user.socket}, {username: data.user1}, io, ' wants to connect.');
          }
        })
      }
    });

    socket.on('cancelstream', data => {
      users.filter(function (obj) {
        if (obj.username === data.conn) {
          obj.streaming = 0;
          obj.conn = '';
          io.sockets.connected[obj.socket].emit("hostcancelstream", obj);
          addNotification({
            username: data.conn,
            socket: obj.socket
          }, {username: data.username}, io, ' declined the connection request.');
        }
        if (obj.username === data.username) {
          obj.streaming = 0;
          obj.conn = '';
        }
      });
    });


    socket.on('logstream', data => {
      addLog(data);
    });

    socket.on('endstreamlog', data => {
      closeLog(data);
      users.filter(function (obj) {
        if (obj.username === data.user1) {
          obj.streaming = 0;
          obj.conn = '';
        }
        if (obj.username === data.user2) {
          obj.streaming = 0;
          obj.conn = '';
          io.sockets.connected[obj.socket].emit("streamend", obj);
        }
      });
    });
  });


  return router;
};

