const express = require(`express`);
const router = express.Router();
const models = require(`../models`);

// Path to edit post
router.get(`/edit/:id`, async (req, res, next) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  const id = req.params.id.trim().replace(/ +(?= )/g, '');
  if (!userId || !userLogin) {
    res.redirect(`/`)
  } else {
    try {
      const post = await models.Post.findById(id);

      if (!post) {
        const err = new Error(`Not Found`);
        err.status = 404;
        next(err);
      }

      res.render(`post/edit`, {
        post,
        user: {
          id: userId,
          login: userLogin
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
});

router.get(`/add`, (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  if (!userId || !userLogin) {
    res.redirect(`/`)
  } else {
    res.render(`post/edit`, {
      user: {
        id: userId,
        login: userLogin
      }
    });
  }
});

// Post add
router.post(`/add`, async (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;

  if (!userId || !userLogin) {
    res.redirect(`/`)
  } else {
    const title = req.body.title.trim().replace(/ +(?= )/g, ''); // Убирает двойные пробелы
    const body = req.body.description.trim();
    const isDraft = !!req.body.isDraft;
    const postId = req.body.postId;
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
      try {
        if (postId) {
          const post = await models.Post.findOneAndUpdate({
            _id: postId,
            owner: userId
          },
          {
            title,
            body,
            owner: userId,
            status: isDraft ? `draft` : `published`
          },
          {
            new: true
          });

          if (!post) {
            res.json({
              ok: false,
              error: `This is not your post`
            });
          } else {
            res.json({
              ok: true,
              post
            });
          }
        } else {
          const post = await models.Post.create({
            title,
            body,
            owner: userId
          });

          res.json({
            ok: true,
            post
          });
        }
      } catch (error) {
        console.log(error);
        res.json({
          ok: false
        });
      }
    }
  }
});

module.exports = router
