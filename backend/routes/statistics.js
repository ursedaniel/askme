const express = require('express');
const router = express.Router();
const Statistic = require('../models/Statistic');
const checkAuth = require('../middleware/check-auth');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const today = moment().startOf('day');
const User = require('../models/User');
const Log = require('../models/Log');

// router.get('', checkAuth, (req, res, next) => {
//   let fetchedUser = jwt.decode(req.get('Authorization').split(' ')[1], 'secret_this_should_be_longer');
//   if (fetchedUser != null)
//     Notification.find({username: fetchedUser.username}).sort({checked: 'asc', date: 'desc'}).then(notifications => {
//       let newNotifications = [];
//       notifications.filter(notification => {
//         newNotifications.push({
//           date: notification.date.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
//           username: notification.username,
//           message: notification.message,
//           checked: notification.checked,
//           _id: notification.id
//         })
//       });
//       res.status(200).json(newNotifications);
//     });
// });

router.post("", checkAuth, (req, res, next) => {
  let fetchedUser = jwt.decode(req.get('Authorization').split(' ')[1], 'secret_this_should_be_longer');
  if (fetchedUser != null) {
    req.body.forEach(userFetched => {
      Statistic.findOne({
        date: {
          $gte: today.toDate(),
          $lte: moment(today).endOf('day').toDate()
        },
        username: userFetched.username,
        profile: false
      }).then(stat => {
        if (stat === null) {
          let statistic = new Statistic({
            username: userFetched.username,
            date: new Date(),
            profile: false
          });
          statistic.save().then(() => {
            User.findOne({username: userFetched.username}).then(user => {
              Statistic.find({
                date: {
                  $gte: today.toDate(),
                  $lte: moment(today).endOf('day').toDate()
                },
                username: user.username,
              }).then((stats) => {
                user.dailyViews = stats.length <= 100 ? stats.length : 100;
                time(user);
              })
            });
          });
        }
      });
    });
    res.status(200).json();
  }
});

router.post("/user", checkAuth, (req, res, next) => {
    let fetchedUser = jwt.decode(req.get('Authorization').split(' ')[1], 'secret_this_should_be_longer');
    if (fetchedUser != null) {
      Statistic.findOne({
        date: {
          $gte: today.toDate(),
          $lte: moment(today).endOf('day').toDate()
        },
        username: req.body.username,
        profile: true
      }).then(stat => {
        if (stat === null) {
          let statistic = new Statistic({
            username: req.body.username,
            date: new Date(),
            profile: true
          });
          statistic.save().then(() => {
            Statistic.find({
              date: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
              },
              username: req.body.username,
            }).then((stats) => {
              User.findOne({username: req.body.username}).then(user => {
                user.dailyViews = stats.length;
                user.score = time(user).then( ()=> {
                  user.save().then(result => {
                    return res.status(200).json();
                  });
                });
              });
            })
          });
        }
      });
      res.status(200).json();
    }
  }
);

async function time(user) {
  var ratingScore = user.rating / 5 * 100;
  var viewsScore = user.dailyViews < 100 ? user.dailyViews : 100;
  var durationScore = 0;
  var reviewsScore = 0;
  var avgDuration = 0;
  var avgReviews = 0;
  var totalScore = 0;
  Log.find().then((logs) => {
    var secondsNoMins = 0;
    logs.forEach((log) => {
      secondsNoMins = secondsNoMins + Number(log.duration.split(':')[0]) * 60 + Number(log.duration.split(':')[1]);
    });
    avgDuration = secondsNoMins / logs.length;
    let userSeconds = Number(user.responseTime.split(':')[0]) * 60 + Number(user.responseTime.split(':')[1]);
    if (userSeconds === 0)
      durationScore = 0;
    else
      durationScore = (userSeconds < avgDuration) ? (userSeconds / avgDuration) * 100 : 100;
    User.find().then((users)=> {
      users.forEach(userNew => {
        avgReviews = avgReviews + userNew.reviews;
      });
      avgReviews = avgReviews / users.length;
      reviewsScore = (user.reviews < avgReviews) ? (user.reviews / avgReviews) * 100 : 100;
      totalScore = (2 * reviewsScore) + (3 * ratingScore) + (4 * viewsScore) + (durationScore);
      user.score = Math.floor(totalScore);
      console.log(user);
      user.save();
    })
  })
}

module.exports = router;

