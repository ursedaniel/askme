const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "src/assets/images/profiles/");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post('/changeimage', multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  let fetchedUser = jwt.decode(req.get('Authorization').split(' ')[1], 'secret_this_should_be_longer');
  if (fetchedUser != null)
    User.findOne({username: fetchedUser.username}).then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }
      user.imagePath =  req.file.filename;
      user.save().then(result => {
        return res.status(200).json({message: 'Image photo changed.', user: user});
      });
    });
});

router.post('/myuser', (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    User.findOne({username: req.body.username}).then(user => {
      user.email = req.body.email;
      user.password = hash;
      user.price = req.body.price;
      user.name = req.body.name;
      user.description = req.body.description;
      user.categories = req.body.categories;
      user.save().then(result => {
        res.status(201).json({
          message: 'User updated!',
          result: result
        })
      })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    });
  });
});

router.get('/myuser', checkAuth, (req, res, next) => {
  let fetchedUser = jwt.decode(req.get('Authorization').split(' ')[1], 'secret_this_should_be_longer');
  if (fetchedUser != null)
    User.findOne({username: fetchedUser.username}).then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }
      fetchedUser = {
        email: user.email,
        password: '',
        username: user.username,
        type: user.type,
        reviews: user.reviews,
        price: user.price,
        rating: user.rating,
        name: user.name,
        online: user.online,
        description: user.description,
        categories: user.categories,
        imagePath: user.imagePath,
        joinDate: user.joinDate.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0]
      };
      return res.status(200).json({message: 'User found.', user: fetchedUser});
    });
});

router.post('/user', checkAuth, (req, res, next) => {
  let fetchedUser = jwt.decode(req.get('Authorization').split(' ')[1], 'secret_this_should_be_longer');
  if (fetchedUser != null)
    User.findOne({username: req.body.username}).then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }
      fetchedUser = {
        email: '',
        password: '',
        username: user.username,
        type: user.type,
        reviews: user.reviews,
        price: user.price,
        rating: user.rating,
        name: user.name,
        online: user.online,
        description: user.description,
        categories: user.categories,
        imagePath: user.imagePath,
        joinDate: user.joinDate.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0]
      };
      return res.status(200).json(fetchedUser);
    });
});

router.get('/connections', checkAuth, (req, res, next) => {
  let fetchedUser = jwt.decode(req.get('Authorization').split(' ')[1], 'secret_this_should_be_longer');
  if (fetchedUser != null)
    User.find({
      online: true,
      username: {$ne: fetchedUser.username},
      type: false,
      categories: req.query.category
    }).then(connections => {
      return res.status(200).json({message: 'Connections found', connections: connections});
    });
  else
    return res.status(200).json({message: 'No connection available', connections: []});
});

module.exports = router;
