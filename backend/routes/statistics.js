const express = require('express');
const router = express.Router();
const Statistic = require('../models/Statistic');
const checkAuth = require('../middleware/check-auth');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const today = moment().startOf('day');
const week = moment().startOf('week');
const month = moment().startOf('month');
const User = require('../models/User');
const Log = require('../models/Log');

router.get('', checkAuth, (req, res, next) => {
  let fetchedUser = jwt.decode(req.get('Authorization').split(' ')[1], 'secret_this_should_be_longer');
  var todayStats = [];
  var weekStats = [];
  if (fetchedUser != null)
    Statistic.find({
      date: {
        $gte: today.toDate(),
        $lte: moment(today).endOf('day').toDate()
      },
      username: fetchedUser.username
    }).sort({date: 'desc'}).then(statsTodayInitial => {
      todayStats.push({
        name: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0],
        value: statsTodayInitial.length
      });
      Statistic.find({
        date: {
          $gte: moment().startOf('week'),
          $lte: moment().endOf('week').toDate()
        },
        username: fetchedUser.username
      }).sort({date: 'desc'}).then(statsWeekInitial => {
        statsWeekInitial.forEach(statWeek => {
          let ok = false;
          if (weekStats.length > 0) {
            for (let i = 0; i < weekStats.length; i++) {
              if (weekStats[i].name === statWeek.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0]) {
                ok = true;
                weekStats[i].value = weekStats[i].value + 1;
              }
            }
            if (!ok) {
              weekStats.push({
                name: statWeek.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0],
                value: 1
              });
            }
          } else
            weekStats.push({
              name: statWeek.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0],
              value: 1
            });
        });
        let fetchedStatsToday = [];
        statsTodayInitial.forEach(statTodayLast => {
          fetchedStatsToday.push({
            date: statTodayLast.date.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            viewer: statTodayLast.viewer,
            profile: statTodayLast.profile
          });
        });
        let fetchedStatsWeek = [];
        statsWeekInitial.forEach(statWeekLast => {
          fetchedStatsWeek.push({
            date: statWeekLast.date.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            viewer: statWeekLast.viewer,
            profile: statWeekLast.profile
          });
        });
        res.status(200).json({
          statsTodayInitial: fetchedStatsToday,
          todayStats: todayStats,
          statsWeekInitial: fetchedStatsWeek,
          weekStats: weekStats
        });
      });
    });
});

router.get('/profile', checkAuth, (req, res, next) => {
  let fetchedUser = jwt.decode(req.get('Authorization').split(' ')[1], 'secret_this_should_be_longer');
  var todayStats = [];
  var weekStats = [];
  if (fetchedUser != null)
    Statistic.find({
      date: {
        $gte: today.toDate(),
        $lte: moment(today).endOf('day').toDate()
      },
      username: fetchedUser.username,
      profile: true
    }).sort({date: 'desc'}).then(statsTodayInitial => {
      todayStats.push({
        name: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0],
        value: statsTodayInitial.length
      });
      Statistic.find({
        date: {
          $gte: moment().startOf('week'),
          $lte: moment().endOf('week').toDate()
        },
        username: fetchedUser.username,
        profile: true
      }).sort({date: 'desc'}).then(statsWeekInitial => {
        statsWeekInitial.forEach(statWeek => {
          let ok = false;
          if (weekStats.length > 0) {
            for (let i = 0; i < weekStats.length; i++) {
              if (weekStats[i].name === statWeek.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0]) {
                ok = true;
                weekStats[i].value = weekStats[i].value + 1;
              }
            }
            if (!ok) {
              weekStats.push({
                name: statWeek.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0],
                value: 1
              });
            }
          } else
            weekStats.push({
              name: statWeek.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0],
              value: 1
            });
        });
        let fetchedStatsToday = [];
        statsTodayInitial.forEach(statTodayLast => {
          fetchedStatsToday.push({
            date: statTodayLast.date.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            viewer: statTodayLast.viewer,
            profile: statTodayLast.profile
          });
        });
        let fetchedStatsWeek = [];
        statsWeekInitial.forEach(statWeekLast => {
          fetchedStatsWeek.push({
            date: statWeekLast.date.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            viewer: statWeekLast.viewer,
            profile: statWeekLast.profile
          });
        });
        res.status(200).json({
          statsTodayInitial: fetchedStatsToday,
          todayStats: todayStats,
          statsWeekInitial: fetchedStatsWeek,
          weekStats: weekStats
        });
      });
    });
});

router.get('/table', checkAuth, (req, res, next) => {
  let fetchedUser = jwt.decode(req.get('Authorization').split(' ')[1], 'secret_this_should_be_longer');
  var todayStats = [];
  var weekStats = [];
  if (fetchedUser != null)
    Statistic.find({
      date: {
        $gte: today.toDate(),
        $lte: moment(today).endOf('day').toDate()
      },
      username: fetchedUser.username,
      profile: false
    }).sort({date: 'desc'}).then(statsTodayInitial => {
      todayStats.push({
        name: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0],
        value: statsTodayInitial.length
      });
      Statistic.find({
        date: {
          $gte: moment().startOf('week'),
          $lte: moment().endOf('week').toDate()
        },
        username: fetchedUser.username,
        profile: false
      }).sort({date: 'desc'}).then(statsWeekInitial => {
        statsWeekInitial.forEach(statWeek => {
          let ok = false;
          if (weekStats.length > 0) {
            for (let i = 0; i < weekStats.length; i++) {
              if (weekStats[i].name === statWeek.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0]) {
                ok = true;
                weekStats[i].value = weekStats[i].value + 1;
              }
            }
            if (!ok) {
              weekStats.push({
                name: statWeek.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0],
                value: 1
              });
            }
          } else
            weekStats.push({
              name: statWeek.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0],
              value: 1
            });
        });
        let fetchedStatsToday = [];
        statsTodayInitial.forEach(statTodayLast => {
          fetchedStatsToday.push({
            date: statTodayLast.date.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            viewer: statTodayLast.viewer,
            profile: statTodayLast.profile
          });
        });
        let fetchedStatsWeek = [];
        statsWeekInitial.forEach(statWeekLast => {
          fetchedStatsWeek.push({
            date: statWeekLast.date.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            viewer: statWeekLast.viewer,
            profile: statWeekLast.profile
          });
        });
        res.status(200).json({
          statsTodayInitial: fetchedStatsToday,
          todayStats: todayStats,
          statsWeekInitial: fetchedStatsWeek,
          weekStats: weekStats
        });
      });
    });
});


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
            viewer: fetchedUser.username,
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
            viewer: fetchedUser.username,
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
                time(user);
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
    User.find().then((users) => {
      users.forEach(userNew => {
        avgReviews = avgReviews + userNew.reviews;
      });
      avgReviews = avgReviews / users.length;
      reviewsScore = (user.reviews < avgReviews) ? (user.reviews / avgReviews) * 100 : 100;
      totalScore = (2 * reviewsScore) + (3 * ratingScore) + (4 * viewsScore) + (durationScore);
      user.score = Math.floor(totalScore);
      user.save();
    })
  })
}

module.exports = router;

