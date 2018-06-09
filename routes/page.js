const express = require(`express`);
const config = require(`../config`);
const models = require(`../models`);
const moment = require(`moment`);

const router = express.Router();
moment.locale(`ru`);

async function posts(req, res) {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  const perPage = +config.PER_PAGE;
  const page = req.params.page || 1;

  try {
    const posts = await models.Post.find({
      status: `published`
    })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate(`owner`)
      .sort({createdAt: -1});

    const count = await models.Post.count();

    res.render(`index`, {
      posts,
      current: page,
      pages: Math.ceil(count / perPage),
      user: {
        id: userId,
        login: userLogin
      }
    });
  } catch (err) {
    throw new Error(`Server Error`);
  }
}

router.get(`/`, (req, res) => {
  posts(req, res);
});

router.get(`/page/:page`, (req, res) => {
  posts(req, res);
});

router.get(`/posts/:post`, async (req, res, next) => {
  const url = req.params.post.trim().replace(/ +(?= )/g, '');
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;

  if (!url) {
    const err = new Error(`Not Found`);
    err.status = 404;
    next(err);
  } else {
    try {
      const post = await models.Post.findOne({
        url,
        status: `published`
      });
      if (!post) {
        const err = new Error(`Not Found`);
        err.status = 404;
        next(err);
      } else {
        const comments = await models.Comment.find({
          post: post.id,
          parent: {$exists: false}
        })
        res.render(`post/post`, {
          post,
          moment,
          user: {
            id: userId,
            login: userLogin
          },
          comments
        });
        console.log(comments)
      }
    } catch (err) {
      throw new Error(`Server Error`);
    }
  }
});

// Users posts
router.get(`/users/:login/:page*?`, async (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  const perPage = +config.PER_PAGE;
  const page = req.params.page || 1;
  const login = req.params.login;

  try {
    const user = await models.User.findOne({ login });

    const posts = await models.Post.find({ owner: user.id })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .sort({createdAt: -1})
      .populate(`owner`);
    const count = await models.Post.count({ owner: user.id });

    res.render(`user/user`, {
      posts,
      current: page,
      _user: user,
      pages: Math.ceil(count / perPage),
      user: {
        id: userId,
        login: userLogin
      }
    });
  } catch (err) {
    throw new Error(`Server Error`);
  }
});

module.exports = router;
