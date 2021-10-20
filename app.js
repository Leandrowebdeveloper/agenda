require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');



const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");


const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});


/*********************************************************************** */


// MONGO DB
const mongoose = require('mongoose');

main().then(() => app.emit('Pronto')).catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
}



// Session
const session = require('express-session');
const connectMongo = require('connect-mongo');
// const flash = require('connect-flash');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const csrf = require('csurf');


/*********************************************************************** */




const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logout = require('./routes/logout');
const dashboard = require('./routes/dashboard');
const { csrfTokenError, localsVar, authentication } = require('./middlewares/middleware');


const app = express();


app.use(connectLiveReload());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const sessionOptions = session({
  secret: process.env.SECRET,
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE_URL,
    resave: true,
    saveUninitialized: false
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  },
});
app.use(sessionOptions);


// security
app.use(helmet());
app.use(csrf({
  cookie: true
}));

app.use(csrfTokenError);
app.use(localsVar);
app.use(authentication);



app.use('/', indexRouter)
app.use('/login', loginRouter);
app.use('/sair', logout);
app.use('/painel-de-controle', dashboard);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;