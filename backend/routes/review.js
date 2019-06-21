const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Review = require('../models/Review');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const Log = require('../models/Log');

router.post('', (req, res, next) => {
  const review = new Review({
    date: req.body.date,
    username1: req.body.username1,
    username2: req.body.username2,
    rating: req.body.rating,
    review: req.body.review
  });
  review.save().then(result => {
    User.findOne({username: review.username2}).then((user) => {
      Review.find({username2: review.username2}).then(reviews => {
        rating = 0;
        noReviews = 0;
        for (let i = 0; i < reviews.length; i++) {
          rating = rating + reviews[i].rating;
          noReviews = noReviews + 1;
        }
        user.rating = rating / noReviews;
        user.reviews = noReviews;
        time(user);
        res.status(201).json({
          message: 'Review saved!',
        })
      })
    })
  })
});

router.get('', checkAuth, (req, res, next) => {
  fetchedReviews = [];
  let fetchedUser = jwt.decode(req.get('Authorization').split(' ')[1], 'secret_this_should_be_longer');
  if (fetchedUser != null) {
    if (req.query.username != null)
      fetchedUser.username = req.query.username;
    Review.find({username2: fetchedUser.username}).sort({date: 'desc'}).then(reviews => {
        for (let i = 0; i < reviews.length; i++) {
          fetchedReviews.push({
            date: reviews[i].date.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            username1: reviews[i].username1,
            username2: reviews[i].username2,
            rating: reviews[i].rating,
            review: reviews[i].review,
            logId: reviews[i].logId,
          });
        }
        return res.status(200).json(fetchedReviews);
      }
    );
  }}
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
  });
}

module.exports = router;
