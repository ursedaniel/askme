const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Review = require('../models/Review');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

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
        user.save();
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
  if (fetchedUser != null)
    Review.find({username2: fetchedUser.username}).then(reviews => {
        for(let i = 0; i < reviews.length; i++) {
          fetchedReviews.push({
          date: reviews[i].date.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
          username1: reviews[i].username1,
          username2: reviews[i].username2,
          rating: reviews[i].rating,
          review: reviews[i].review,
          logId: reviews[i].logId,
          });
          return res.status(200).json(fetchedReviews);
        }
      }
    );
});

module.exports = router;
