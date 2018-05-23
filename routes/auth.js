const express = require(`express`);
const router = express.Router();
const bcrypt = require(`bcrypt-nodejs`);

const models = require(`../models`);

router.post(`/login`, (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  if (!login || !password) {
    res.json({
      ok: false,
      error: `All fields must be fill`,
      fields: [`login`, `password`]
    });
  } else {
    models.User.findOne({
      login
    })
    .then(user => {
      if (!user) {
        res.json({
          ok: false,
          error: `Login and password incorrect`,
          fields: [`login`, `password`]
        });
      } else {
        bcrypt.compare(password, user.password, function(err, result) {
          if (!result) {
            res.json({
              ok: false,
              error: `Login and password incorrect`,
              fields: [`login`, `password`]
            });
          } else {
            req.session.userId = user.id;
            req.session.userLogin = user.login
            res.json({
              ok: true
            });
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.json({
        ok: false,
        error: `Please try later`
      });
    })
  }
});

module.exports = router;
