const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const checkAuth = require('../middleware/check-auth');
const jwt = require('jsonwebtoken');

router.get('', checkAuth, (req, res, next) => {
  fetchedLogs = [];
  chartLogs = [];
  let fetchedUser = jwt.decode(req.get('Authorization').split(' ')[1], 'secret_this_should_be_longer');
  if (fetchedUser != null)
    if (req.query.type == 'true')
      Log.find({username1: fetchedUser.username}).sort({dateStart: 'desc'}).then(logs => {
        for (let i = 0; i < logs.length; i++) {
          let ok = false;
          fetchedLogs.push({
            dateStart: logs[i].dateStart.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            dateEnd: logs[i].dateEnd.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            price: logs[i].price,
            username1: logs[i].username1,
            username2: logs[i].username2,
            duration: logs[i].duration
          });
          if (chartLogs.length > 0) {
            for (let j = 0; j < chartLogs.length; j++) {
              if (chartLogs[j].name.split('-')[1] ===
                logs[i].dateStart.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0].split('-')[1]) {
                ok = true;
                chartLogs[j].value = chartLogs[j].value + Number(logs[i].price);
                break;
              }
            }
            if (!ok) {
              let name = logs[i].dateStart.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0].split('-');
              chartLogs.push({
                name: name[0] + '-' + name[1],
                value: Number(logs[i].price)
              });
            }
          } else {
            let name = logs[i].dateStart.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0].split('-');
            chartLogs.push({
              name: name[0] + '-' + name[1],
              value: Number(logs[i].price)
            });
          }
        }
        res.status(200).json({logs: fetchedLogs, chart: chartLogs});
      });
    else {
      Log.find({username2: fetchedUser.username}).sort({dateStart: 'desc'}).then(logs => {
          for (let i = 0; i < logs.length; i++) {
            let ok = false;
            fetchedLogs.push({
              dateStart: logs[i].dateStart.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
              dateEnd: logs[i].dateEnd.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
              price: logs[i].price,
              username1: logs[i].username1,
              username2: logs[i].username2,
              duration: logs[i].duration
            });
            if (chartLogs.length > 0) {
              for (let j = 0; j < chartLogs.length; j++) {
                if (chartLogs[j].name.split('-')[1] ===
                  logs[i].dateStart.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0].split('-')[1]) {
                  ok = true;
                  chartLogs[j].value = chartLogs[j].value + Number(logs[i].price);
                  break;
                }
              }
              if (!ok) {
                let name = logs[i].dateStart.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0].split('-');
                chartLogs.push({
                  name: name[0] + '-' + name[1],
                  value: Number(logs[i].price)
                });
              }
            } else {
              let name = logs[i].dateStart.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0].split('-');
              chartLogs.push({
                name: name[0] + '-' + name[1],
                value: Number(logs[i].price)
              });
            }
          }
          res.status(200).json({logs: fetchedLogs, chart: chartLogs});
        }
      );
    }
});

module.exports = router;

