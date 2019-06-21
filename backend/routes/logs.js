const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const checkAuth = require('../middleware/check-auth');
const jwt = require('jsonwebtoken');

router.get('', checkAuth, (req, res, next) => {
  fetchedLogs = [];
  let fetchedUser = jwt.decode(req.get('Authorization').split(' ')[1], 'secret_this_should_be_longer');
  if (fetchedUser != null)
    if(req.query.type == 'true')
    Log.find({username1: fetchedUser.username}).sort({id: 'desc'}).then(logs => {
      for(let i = 0; i < logs.length; i++) {
        fetchedLogs.push ({
          dateStart : logs[i].dateStart.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
          dateEnd: logs[i].dateEnd.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
          price: logs[i].price,
          username1: logs[i].username1,
          username2: logs[i].username2,
          duration: logs[i].duration
        });
      }
        res.status(200).json(fetchedLogs);
    });
    else {
      Log.find({username2: fetchedUser.username}).sort({id: 'desc'}).then(logs => {
        for(let i = 0; i < logs.length; i++) {
          fetchedLogs.push ({
            dateStart : logs[i].dateStart.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            dateEnd: logs[i].dateEnd.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            price: logs[i].price,
            username1: logs[i].username1,
            username2: logs[i].username2,
            duration: logs[i].duration
          });
        }
        res.status(200).json(fetchedLogs);
      });
    }
});

module.exports = router;

