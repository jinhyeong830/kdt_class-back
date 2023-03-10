const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;

const verifyModule = require('./register').verifyPassword;

const mongoClient = require('./mongo');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'id',
        passwordField: 'password',
      },
      async (id, password, cb) => {
        const client = await mongoClient.connect();
        const userCursor = client.db('kdt1').collection('users');
        const idResult = await userCursor.findOne({ id });
        if (idResult !== null) {
          if (idResult.salt !== undefined) {
            const passwordResult = verifyModule(
              password,
              idResult.salt,
              idResult.password
            );
            if (passwordResult) {
              cb(null, idResult); // 에러 없고, 실제 id..result
            } else {
              cb(null, false, { message: '비밀번호가 틀렸씁니다.' });
            }
          } else if (idResult.password === password) {
            cb(null, idResult);
          } else {
            cb(null, false, { message: '비밀번호가 틀렸습니다.' });
          }
        } else {
          cb(null, false, { message: '해당 id가 없습니다' });
        }
      }
    )
  );

  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_CLIENT,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: process.env.NAVER_CB_URL,
      },
      async (accessTocken, refreshTocken, profile, cb) => {
        console.log(profile);
        // cb(null, profile);
        // profile 의 id가 있으면
        const client = await mongoClient.connect();
        const userCursor = client.db('kdt1').collection('users');
        const result = await userCursor.findOne({ id: profile.id });
        if (result !== null) {
          cb(null, result);
        } else {
          console.log('nickname', profile.displayName);

          const newUser = {
            id: profile.id,
            name:
              profile.displayName !== undefined
                ? profile.displayName
                : profile.emails[0]?.value, //email이 안올 수도 있으니까 ? 붙여서 에러를 방지하는 것
            provider: profile.provider,
          };
          const dbResult = await userCursor.insertOne(newUser);
          if (dbResult.acknowledged) {
            cb(null, newUser);
          } else {
            cb(null, false, { message: '회원 생성 에러' });
          }
        }
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CB_URL,
      },
      async (accessTocken, refreshTocken, profile, cb) => {
        console.log(profile);
        // cb(null, profile);
        // profile 의 id가 있으면
        const client = await mongoClient.connect();
        const userCursor = client.db('kdt1').collection('users');
        const result = await userCursor.findOne({ id: profile.id });
        if (result !== null) {
          cb(null, result);
          console.log('띠영');
        } else {
          console.log('nickname', profile.displayName);

          const newUser = {
            id: profile.id,
            name:
              profile.displayName !== undefined
                ? profile.displayName
                : profile.emails[0]?.value,
            provider: profile.provider,
          };
          const dbResult = await userCursor.insertOne(newUser);
          if (dbResult.acknowledged) {
            cb(null, newUser);
          } else {
            cb(null, false, { message: '회원 생성 에러' });
          }
        }
      }
    )
  );

  /* kakao 자동 로그인 */
  passport.use(
    new KakaoStrategy(
      {
        clientID: 'c7c053fadbdc8e726b6c25fe09297077',
        callbackURL: 'http://localhost:4000/login/auth/kakao/callback',
      },
      async (accessTocken, refreshTocken, profile, cb) => {
        console.log(profile);
        // cb(null, profile);
        // profile 의 id가 있으면
        const client = await mongoClient.connect();
        const userCursor = client.db('kdt1').collection('users');
        const result = await userCursor.findOne({ id: profile.id });
        if (result !== null) {
          cb(null, result);
        } else {
          console.log('nickname', profile.displayName);

          const newUser = {
            id: profile.id,
            name:
              profile.displayName !== undefined
                ? profile.displayName
                : profile.emails[0]?.value,
            provider: profile.provider,
          };
          const dbResult = await userCursor.insertOne(newUser);
          if (dbResult.acknowledged) {
            cb(null, newUser);
          } else {
            cb(null, false, { message: '회원 생성 에러' });
          }
        }
      }
    )
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser(async (id, cb) => {
    const client = await mongoClient.connect();
    const userCursor = client.db('kdt1').collection('users');
    const result = await userCursor.findOne({ id });
    if (result !== null) cb(null, result);
  });
};
