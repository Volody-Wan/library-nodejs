const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const process = require('process');
const http = require('http');
const stoppable = require('stoppable');
require('dotenv').config();

const { NAV } = require('./src/constants/constants.js');

const app = express();
const port = process.env.PORT || 3000;

const server = stoppable(http.createServer(app), 2500);

const sess = {
  secret: 'librarianAlexandrian',
  resave: false,
  saveUninitialized: false,
  cookie: {},
  store: new MongoStore({
    url: `${process.env.DB_HOST}\\${process.env.DB_NAME}`,
  }),
};

if (process.env.NOVE_ENV === 'production') {
  app.set('trust proxy', 1);
  sess.cookie.secure = true;
}

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(sess));
app.use(flash());
require('./src/config/passport.js')(app);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));
app.use('/css', express.static(path.join(__dirname, 'node_modules', 'font-awesome', 'css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'popper.js', 'dist', 'umd')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'axios', 'dist')));
app.use('/js', express.static(path.join(__dirname, 'src', 'scripts')));

app.set('views', './src/views');
app.set('view engine', 'ejs');

const bookRouter = require('./src/routes/bookRoutes')(NAV);
const authRouter = require('./src/routes/authRoutes')(NAV);
const loginRouter = require('./src/routes/loginRoutes')(NAV);
const profileRouter = require('./src/routes/profileRoutes')(NAV);
const authorsRouter = require('./src/routes/authorsRoutes')(NAV);
const searchRouter = require('./src/routes/searchRoutes')(NAV);
const adminRoutes = require('./src/routes/adminRoutes')(NAV);
const healthRoutes = require('./src/routes/healthRoutes')();

app.use('/books', bookRouter);
app.use('/auth', authRouter);
app.use('/login', loginRouter);
app.use('/profile', profileRouter);
app.use('/authors', authorsRouter);
app.use('/search', searchRouter);
app.use('/admin', adminRoutes);
app.use('/health', healthRoutes);

app.route('/')
  .all((req, res) => {
    if (req.user) {
      res.redirect('/books');
    } else {
      res.redirect('/login');
    }
  });

server.listen(port, () => {
  debug(`listening on port ${chalk.blue(port)}`);
});

process.on('SIGINT', function onSigint() {
  app.shutdown();
});

process.on('SIGTERM', function onSigterm() {
  app.shutdown();
});

app.shutdown = function () {
  server.close(function onServerClosed(err) {
    if (err) {
      log.error('An error occurred while closing the server: ' + err);
      process.exitCode = 1;
    }
  });
  process.exit();
};