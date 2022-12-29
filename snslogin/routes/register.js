// @ts-check
const express = require('express');
const crypto = require('crypto');

const router = express.Router();
const mongoClient = require('./mongo');

const createHashedPassword = (password) => {
  const salt = crypto.randomBytes(64).toString('base64');
  // return crypto.createHash('sha512').update(password).digest('base64'); // digest 는 인코딩 방식

  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 10, 64, 'sha512')
    .toString('base64');
  return { hashedPassword, salt };
};

// 로그인할 때 사용되는 함수
const verifyPassword = (password, salt, userPassword) => {
  const hashed = crypto
    .pbkdf2Sync(password, salt, 10, 64, 'sha512')
    .toString('base64');

  if (hashed === userPassword) return true;
  return false;
};

router.get('/', (req, res) => {
  // const userPw = createHashedPassword('1234');
  // console.log(verifyPassword('1234', salt, userPw));
  res.render('register');
});

router.post('/', async (req, res) => {
  const client = await mongoClient.connect();
  const userCursor = client.db('kdt1').collection('users');
  const duplicated = await userCursor.findOne({ id: req.body.id });

  // req.body.password에 담아서
  const passwordResult = createHashedPassword(req.body.password); // pw& salt를 같이 반납
  if (duplicated === null) {
    const result = await userCursor.insertOne({
      id: req.body.id,
      name: req.body.id,
      password: passwordResult.hashedPassword,
      salt: passwordResult.salt,
    });
    console.log(result);
    if (result.acknowledged) {
      res.status(200);
      res.send('회원 가입 성공!<br><a href="/login">로그인 페이지로 이동</a>');
    } else {
      res.status(500);
      res.send(
        '회원 가입 문제 발생!<br><a href="/register">회원 가입 페이지로 이동</a>'
      );
    }
  } else {
    res.status(300);
    res.send(
      '중복된 id 가 존재합니다!<br><a href="/register">회원 가입 페이지로 이동</a>'
    );
  }
});

module.exports = { router, verifyPassword };
