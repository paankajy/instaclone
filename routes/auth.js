const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
  res.send('hello');
});

router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  if (!name || !email || !password) {
    return res.status(422).json({ error: 'please add all the field' });
  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: 'user already exists with that email' });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          name,
          email,
          password: hashedpassword,
        });

        user
          .save()
          .then((user) => {
            res.json({ message: 'saved successfully' });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: 'please provide email or password' });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: 'Invalid Email or password' });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          res.json({ message: 'successfully signed in' });
        } else {
          return res.status(422).json({ error: 'Invalid Email or password' });
        }
      })
      .catch((err) => [console.log(err)]);
  });
});
module.exports = router;
