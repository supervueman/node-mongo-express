const express = require(`express`);
const router = express.Router();
const bcrypt = require(`bcrypt-nodejs`);

const models = require(`../models`);

router.post(`/register`, (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  const confpassword = req.body.passwordConfirm;

  if (!login || !password || !confpassword) {
    res.json({
      ok: false,
      error: `All fields must be fill`,
      fields: [`login`, `password`, `confpassword`]
    });
  } else if (!/^[a-zA-Z0-9]+$/.test(login)) {
    res.json({
      ok: false,
      error: `Login must be english`,
      fields: [`login`]
    });
  } else if (login.length < 3 || login.length > 16) {
    res.json({
      ok: false,
      error: `Login length must be 3 - 30 symbols`,
      fields: [`login`]
    });
  } else if (password !== confpassword) {
    res.json({
      ok: false,
      error: `Passwords is not equals`,
      fields: [`login`]
    });
  } else if (login.length < 5) {
    res.json({
      ok: false,
      error: `Passwords must be > 5 symbols`,
      fields: [`password`, `confpassword`]
    });
  } else {
    models.User.findOne({
      login
    }).then(user => {
      if (!user) {
        bcrypt.hash(password, null, null, (err, hash) => {
          models.User.create({
            login,
            password: hash
          }).then(user => {
            console.log(user);
            req.session.userId = user.id;
            req.session.userLogin = user.login
            res.json({
              ok: true
            });
          }).catch(err => {
            console.log(err);
            res.json({
              ok: false,
              error: `Please try later`
            });
          });
        });
      } else {
        console.log(user);
        res.json({
          ok: false,
          error: `The name is used`
        });
      }
    });
  }
});

module.exports = router;
