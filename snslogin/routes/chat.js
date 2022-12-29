const express = require('express');

const router = express.Router();

const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  // wss.clients 는 모든 client를 배열형태로 가지고 있음.
  wss.clients.forEach((client) => {
    client.send(
      `새로운 유저가 참가했습니다. 현재 유저 수는 ${wss.clients.size}`
    );
  });
  //   모든 유저에게 뿌려주기
  ws.on('message', (message) => {
    wss.clients.forEach((client) => {
      //   client.send(message.toString());
      client.send(`${message}`);
    });
  });

  ws.on('close', () => {
    wss.clients.forEach((client) => {
      client.send(`유저 한명이 나갓습니다. 현재유저수 : ${wss.clients.size}`);
    });
  });
  /* ws.send('저는 서버입니다. 들리나요?');

  ws.on('message', (message) => {
    console.log(message.toString()); //message는 버퍼형식으로 오기 때문에 String으로 바꿔주는 작업을 해야 볼 수 있다.
  }); */
});

router.get('/', (req, res) => {
  res.render('chat');
});
module.exports = router;
