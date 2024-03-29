const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
app.io = require('socket.io')({
  transports: ['websocket']
});
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');
const notificationsRoutes = require('./routes/notifications');
const reviewRoutes = require('./routes/review');
const logsRoutes = require('./routes/logs');
const statisticsRoutes = require('./routes/statistics');
const authRoutes = require('./routes/auth')(app.io);
mongoose.connect("mongodb+srv://haboks:SP6gpTHYEuBd2sk9@cluster0-qcgyi.mongodb.net/askme?retryWrites=true", {useNewUrlParser: true})
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(() => {
    console.log('Connection failed');
  });

app.use(bodyParser.json());

var cors = require('cors');
var corsOptions = {
  origin: '*',
  credentials: true };

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200', {credentials: true});
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
  next();
});

app.use('/api/auth',authRoutes);
app.use('/api/posts',postsRoutes);
app.use('/api/users',usersRoutes);
app.use('/api/notifications',notificationsRoutes);
app.use('/api/reviews',reviewRoutes);
app.use('/api/logs',logsRoutes);
app.use('/api/statistics',statisticsRoutes);

/**
 * Socket events
 */
module.exports = app;
