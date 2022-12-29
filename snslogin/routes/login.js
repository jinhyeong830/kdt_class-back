// @ts-check

const express = require('express');

const router = express.Router();

const passport = require('passport');

// const mongoClient = require('./mongo');

const isLogin = (req, res, next) => {
  if (req.session.login || req.user || req.signedCookies.user) {
    next();
  } else {
    res.status(300);
    res.send(
      '로그인이 필요한 서비스 입니다.<br><a href="/login">로그인 페이지로 이동</a><br><a href="/">메인 페이지로 이동</a>'
    );
  }
};

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err;
    if (!user) {
      return res.send(
        `${info.message}<br><a href="/login">로그인 페이지로 이동</a>`
      );
    }
    req.logIn(user, (err) => {
      if (err) throw err;
      res.cookie('user', req.body.id, {
        expires: new Date(Date.now() + 1000 * 60),
        httpOnly: true,
        signed: true,
      });
      res.redirect('/board');
    });
  })(req, res, next);
});

router.get('/logout', (req, res, next) => {
  // 세션으로 로그아웃하기
  // req.session.destroy((err) => {
  //   if (err) throw err;
  //   res.redirect('/');
  // });

  req.logOut((err) => {
    if (err) return next(err); // 에러 있을때 next로 err던져주기
    return res.redirect('/');
  });
});

// auth를 위한 코드
router.get('/auth/naver', passport.authenticate('naver')); // naver전략을 쓴다고 알려주는 것

// 실제적인로그인 처리는 여기서 진행됨
router.get(
  '/auth/naver/callback',
  passport.authenticate('naver', {
    successRedirect: '/board',
    failureRedirect: '/',
  })
);

/* Naver */
router.get('/auth/google', passport.authenticate('google', { scope: 'email' })); // naver전략을 쓴다고 알려주는 것

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/board',
    failureRedirect: '/',
  })
);

/* 카카오 */
router.get('/auth/kakao', passport.authenticate('kakao'));

router.get(
  '/auth/kakao/callback',
  passport.authenticate('kakao', {
    successRedirect: '/board',
    failureRedirect: '/',
  })
);

module.exports = { router, isLogin };
