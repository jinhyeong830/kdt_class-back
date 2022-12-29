// @ts-check

const express = require('express');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config(); // dotenv 호출 , 변수에 담아서 사용하지 않아도 됨

const app = express();
const PORT = process.env.PORT;

// 바디파서
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 쿠키파서
app.use(cookieParser('jjss')); // 암호화된 쿠키
// 세션
app.use(
  session({
    secret: 'jjss',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);
// 패스포트
app.use(passport.initialize());
app.use(passport.session());

// 사용자 모듈
const router = require('./routes/index');
const boardRouter = require('./routes/board');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const passportRouter = require('./routes/passport');
const chatRouter = require('./routes/chat');

passportRouter();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// 라우팅
app.use('/', router);
app.use('/board', boardRouter);
app.use('/register', registerRouter.router);
app.use('/login', loginRouter.router);
app.use('/chat', chatRouter);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.statusCode || 500);
  res.end(err.message);
});

app.listen(PORT, () => {
  console.log(`The express server is running at ${PORT}`);
});
