const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // body-parser 를 위한 코드

app.set('view engine', 'ejs'); // 뷰 엔진  : ejs
app.set('views', 'views'); // views 폴더 이름은 views
app.use(express.static('public')); // static 폴더 이름은 public으로

const router = require('./routes'); // /index 는 생략한 형태
const blog = require('./routes/blog');
// const newPost = require('./routes/newPost');

app.use('/', router);
app.use('/blog', blog);
// app.use('/blog/newPost', newPost);

// 선생님 코드 참고해서 바꾸기
app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.statusCode);
  res.console.log(err.statusCode || 500);
  res.end(err.message);
});

// listen

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`PORT ${PORT} server is opened !!`);
  console.log(`http://localhost:${PORT}`);
});
