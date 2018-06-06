const express = require(`express`);
const router = express.Router();
const TurndownService = require(`turndown`);
const models = require(`../models`);

router.get(`/add`, (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  if (!userId || !userLogin) {
    res.redirect(`/`)
  } else {
    res.render(`post/add`, {
      user: {
        id: userId,
        login: userLogin
      }
    });
  }
});

// Post add
router.post(`/add`, (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;

  if (!userId || !userLogin) {
    res.redirect(`/`)
  } else {
    const title = req.body.title.trim().replace(/ +(?= )/g, ''); // Убирает двойные пробелы
    const body = req.body.description;
    const turndownService = new TurndownService();
    if (!title || !body) {
      const fields = [];
      if (!title) fields.push(`title`);
      if (!body) fields.push(`body`);
      res.json({
        ok: false,
        error: `All fields must be fill`,
        fields
      });
    } else {
      models.Post.create({
        title,
        body: turndownService.turndown(body),
        owner: userId
      }).then(post => {
        console.log(post);
        res.json({
          ok: true
        });
      }).catch(err => {
        console.log(err);
        res.json({
          ok: false
        });
      });
    }
  }
});

module.exports = router
