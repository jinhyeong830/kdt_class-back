// @ts-check
const express = require('express');

const router = express.Router();

const mongoClient = require('./mongo');

function isLogin(req, res, next) {
  if (req.session.login || req.user) {
    next();
  } else {
    res.status(300);
    res.send(
      '로그인이 필요한 서비스 입니다.<br><a href="/login">로그인 페이지로 이동</a>'
    );
  }
}

router.get('/', isLogin, async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('kdt1').collection('board');
  const ARTICLE = await cursor.find({}).toArray();
  const articleLen = ARTICLE.length;
  res.render('board', {
    ARTICLE,
    articleCounts: articleLen,
    userId: req.session.userId ? req.session.userId : req.user.id,
  });
});

router.get('/write', isLogin, (req, res) => {
  res.render('board_write');
});

router.post('/write', isLogin, async (req, res) => {
  if (req.body.title && req.body.content) {
    const newArticle = {
      id: req.session.userId,
      title: req.body.title,
      content: req.body.content,
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

router.get('/modify/title/:title', isLogin, async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('kdt1').collection('board');
  const selectedArticle = await cursor.findOne({ title: req.params.title });
  res.render('board_modify', { selectedArticle });
});

router.post('/modify/title/:title', isLogin, async (req, res) => {
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

router.delete('/delete/title/:title', isLogin, async (req, res) => {
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
