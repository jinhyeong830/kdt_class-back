// @ts-check
const Koa = require('koa');
const websockify = require('koa-websocket');
const route = require('koa-route');
const serve = require('koa-static');
const mount = require('koa-mount'); // static and mount -> 스태틱 폴더 지정을 위한 두 개의 모듈

const Pug = require('koa-pug');
const path = require('path');

const mongoClient = require('./public/mongo');

const _client = mongoClient.connect(); //connect는 promise객체 반환함 사용할 때마다 await걸어서 풀어주면 댐

const app = websockify(new Koa()); // web소켓도 가능하게
const PORT = 4500;

app.use(mount('/public', serve('public'))); // static 폴더 지정
const pug = new Pug({
  viewPath: path.resolve(__dirname, './views'),
  app,
});

// 웹소켓에 대한 서버
app.ws.use(
  route.all('/chat', async (ctx) => {
    // const server = app.ws.server;
    const { server } = app.ws; // 위와 정확하게 같은 의미
    // 기존채팅로그는 새로운 유저가 참여하기 전에 찍혀야 함
    const client = await _client;

    const cursor = client.db('kdt1').collection('chats');
    const chats = cursor.find(
      {},
      {
        sort: {
          createdAt: 1, //1 is 오름차순 -1은 내림차순
        },
      }
    ); // 전체를 찾는 과정은 await안걸어줘도 됨
    const chatsData = await chats.toArray(); //모든 채팅 내역들이 배열로 변해서 들어가게 됨

    // 접속한 사람에게만 배열내용 보내주면 (유니캐스트))
    ctx.websocket.send(
      JSON.stringify({
        type: 'sync',
        data: {
          chatsData, //받아놓은 배열데이터를 통으로 던지면 됩니다.
        },
      })
    );
    server.clients.forEach((client) => {
      //   client.send('모든 client에게 데이터를 보낸다 실시!');
      client.send(
        JSON.stringify({
          type: 'chat',
          data: {
            name: '서버',
            msg: `새로운 유저가 참여했습니다. 현재 유저 수${server?.clients.size}`,
            bg: 'bg-danger',
            text: 'text-white',
          },
        })
      );
    });
    // console.log(app.ws);
    // ctx.websocket.send('여긴 서버입니다. 보이세여ㅕ?');

    // 클라이언트에게 메세지 보내주는.
    ctx.websocket.on('message', async (message) => {
      //   console.log(message.toString());

      const chat = JSON.parse(message);
      const insertClinet = await _client; // _client 에 있는
      const chatCursor = insertClinet.db('kdt1').collection('chats');
      /* name: chat.name,
        message: chat.message,
        bg: chat.bg,
        text: chat.text,  대신
        ...chat 을 사용! 두 코드는 동일한 의미*/

      await chatCursor.insertOne({ ...chat, createdAt: new Date() });
      server.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            type: 'chat',
            data: {
              ...chat,
            },
          })
        );
      });
    });

    ctx.websocket.on('close', () => {
      server.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            type: 'chat',
            data: {
              name: '서버',
              msg: `유저 한 명이 나갔습니다. 현재 유저 수${server?.clients.size}`,
              bg: 'bg-dark',
              text: 'text-white',
            },
          })
        );
      });
    });
  })
);
app.use(async (ctx, next) => {
  await ctx.render('chat');
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
