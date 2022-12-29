// @ts-check
const express = require('express');
const multer = require('multer');
const fs = require('fs');

const router = express.Router();

const mongoClient = require('./mongo');

const login = require('./login');

const dir = './uploads';
const storage = multer.diskStorage({
  // 기본속성 destination, filename
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now());
    // file.fieldname = file의 원래 이름명
    // 파일명이 겹치지 않도록 +~를  해 준 것
  },
});

const limits = {
  fileSize: 1024 * 1024 * 2, //2MB 파일까지 한게를 걸어두기 위해
};

// 위의 설정값을 담아서 upload변수에 담아둠 = 실제 업로드는 upload를 이용해서
const upload = multer({ storage, limits });

router.get('/', login.isLogin, async (req, res) => {
  console.log(req.user);
  const client = await mongoClient.connect();
  const cursor = client.db('kdt1').collection('board');
  const ARTICLE = await cursor.find({}).toArray();
  const articleLen = ARTICLE.length;
  res.render('board', {
    ARTICLE,
    articleCounts: articleLen,
    userId: req.session.userId
      ? req.session.userId
      : req.user?.id
      ? req.user?.id
      : req.signedCookies.user,
  });
});

router.get('/write', login.isLogin, (req, res) => {
  res.render('board_write');
});

router.post('/write', login.isLogin, upload.single('img'), async (req, res) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  console.log(req);
  console.log(req.file);
  if (req.body.title && req.body.content) {
    const newArticle = {
      id: req.session.userId ? req.session.userId : req.user.id,
      userName: req.user?.name ? req.user.name : req.user?.id,
      title: req.body.title,
      content: req.body.content,
      img: req.file ? req.file.filename : null,
    };

    const client = await mongoClient.connect();
    const cursor = client.db('kdt1').collection('board');
    await cursor.insertOne(newArticle);
    res.redirect('/board');
  } else {
    const err = new Error('데이터가 없습니다');
    err.statusCode = 404;
    throw err;
  }
});

router.get('/modify/title/:title', login.isLogin, async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('kdt1').collection('board');
  const selectedArticle = await cursor.findOne({ title: req.params.title });
  res.render('board_modify', { selectedArticle });
});

router.post('/modify/title/:title', login.isLogin, async (req, res) => {
  if (req.body.title && req.body.content) {
    const client = await mongoClient.connect();
    const cursor = client.db('kdt1').collection('board');
    await cursor.updateOne(
      { title: req.params.title },
      { $set: { title: req.body.title, content: req.body.content } }
    );
    res.redirect('/board');
  } else {
    const err = new Error('요청 값이 없습니다.');
    err.statusCode = 404;
    throw err;
  }
});

router.delete('/delete/title/:title', login.isLogin, async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('kdt1').collection('board');
  const result = await cursor.deleteOne({ title: req.params.title });

  if (result.acknowledged) {
    res.send('삭제 완료');
  } else {
    const err = new Error('삭제 실패');
    err.statusCode = 404;
    throw err;
  }
});

module.exports = router;
