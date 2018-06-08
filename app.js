const express = require(`express`);
const bodyParser = require(`body-parser`);
const path = require(`path`);
const staticAsset = require(`static-asset`);
const mongoose = require(`mongoose`);
const session = require(`express-session`);
const MongoStore = require(`connect-mongo`)(session);
const config = require(`./config`);
const routes = require(`./routes`);
// const mocks = require(`./mocks`);

//Database
mongoose.Promise = global.Promise;
mongoose.set(`debug`, config.IS_PRODUCTION);
mongoose.connection
  .on(`error`, error => console.log(error))
  .on(`close`, () => console.log(`Database connection close`))
  .once(`open`, () => {
    // mocks();
    const info = mongoose.connections[0];
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
  })
mongoose.connect(config.MONGO_URL);

//Express
const app = express();

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

app.set(`view engine`, `ejs`);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(staticAsset(path.join(__dirname, `public`)));
app.use(express.static(path.join(__dirname, `public`)));
app.use(
  `/js`,
  express.static(path.join(__dirname, `node_modules`, `jquery`, `dist`))
);

// Routers
app.use('/', routes.page);
app.use('/api/auth/', routes.reg);
app.use('/api/auth/', routes.auth);
app.use('/api/auth/', routes.logout);
app.use('/post', routes.post);
app.use('/comment', routes.comment);

app.use((req, res, next) => {
  const err = new Error(`Not Found`);
  err.status = 404;
  next(err);
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.render(`error`, {
    message: error.message,
    error: !config.IS_PRODUCTION ? error : {}
  });
});

app.listen(config.PORT, () => console.log(`Example app listening on port ${config.PORT}!`));
