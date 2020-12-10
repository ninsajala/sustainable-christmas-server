require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const path = require('path');
const cors = require('cors');
const passport = require('passport');

require('./configs/db-congif');

const app_name = require('./package.json').name;
const debug = require('debug')(
  `${app_name}:${path.basename(__filename).split('.')[0]}`
);

const app = express();

require('./configs/session-config')(app);
require('./configs/passport-config');

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

// Express View engine setup

app.use(
  require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    sourceMap: true,
  })
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.locals.title = 'Sustainable Christmas - Server';

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', process.env.FRONTEND_POINT],
  })
);

const index = require('./routes/index');
app.use('/', index);

const tips = require('./routes/christmas-tip-routes');
app.use('/', tips);

const comments = require('./routes/comment-routes');
app.use('/', comments);

const auth = require('./routes/auth-routes');
app.use('/', auth);

const fileUpload = require('./routes/file-upload-routes');
app.use('/', fileUpload);

const user = require('./routes/user-routes');
app.use('/', user);

module.exports = app;
