const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const checkAuth = require('../middleware/check-auth');
const jwt = require('jsonwebtoken');

router.get('', checkAuth, (req, res, next) => {
  let fetchedUser = jwt.decode(req.get('Authorization').split(' ')[1], 'secret_this_should_be_longer');
  if (fetchedUser != null)
    Notification.find({username: fetchedUser.username}).sort({checked: 'asc', date: 'desc'}).then(notifications => {
      let newNotifications = [];
      notifications.filter(notification => {
        newNotifications.push({
          date: notification.date.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
          username: notification.username,
          message: notification.message,
          checked: notification.checked,
          _id: notification.id
        })
      });
      res.status(200).json(newNotifications);
    });
});

router.post("/check", checkAuth, (req, res, next) => {
  Notification.findOne({_id: req.body._id}).then(notification => {
    notificationNew = notification;
    notificationNew.checked = !notificationNew.checked;
    notificationNew.save();
    res.status(201).json();
  });
  // Notification.update({'id': req.body._id},{$set: {checked: true}});
});

router.get("/checkAll", checkAuth, (req, res, next) => {
  let fetchedUser = jwt.decode(req.get('Authorization').split(' ')[1], 'secret_this_should_be_longer');
  if (fetchedUser != null)
  Notification.updateMany({username: fetchedUser.username}, { checked: true }).then(() => {
    res.status(201).json();
  });
  // Notification.update({'id': req.body._id},{$set: {checked: true}});
});

router.get("/deleteAll", checkAuth, (req, res, next) => {
  let fetchedUser = jwt.decode(req.get('Authorization').split(' ')[1], 'secret_this_should_be_longer');
  if (fetchedUser != null)
    Notification.deleteMany({username: fetchedUser.username}).then(() => {
      res.status(201).json();
    });
  // Notification.update({'id': req.body._id},{$set: {checked: true}});
});

module.exports = router;

