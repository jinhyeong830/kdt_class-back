// @ts-check

/* IIFE :  */
(() => {
  const socket = new WebSocket(`ws://${window.location.host}/chat`);

  const btn = document.getElementById('btn');
  const inputEl = document.querySelector('#input');
  const chatEl = document.getElementById('chat');

  const adj = [
    '멋진',
    '잘생긴',
    '예쁜',
    '졸린',
    '우아한',
    '힙한',
    '배고픈',
    '집에 가기 싫은',
    '집에 가고 싶은',
    '귀여운',
    '중후한',
    '똑똑한',
    '이게 뭔가 싶은',
    '까리한',
    '프론트가 하고 싶은',
    '백엔드가 재미 있는',
    '몽고 디비 날려 먹은',
    '열심히하는',
    '피곤한',
    '눈빛이 초롱초롱한',
    '치킨이 땡기는',
    '술이 땡기는',
  ];
  const member = [
    '유림님',
    '지훈님',
    '한솔님',
    '윤비님',
    '승환님',
    '영은님',
    '수지님',
    '종익님',
    '혜영님',
    '준우님',
    '진형님',
    '민정님',
    '소민님',
    '지현님',
    '다영님',
    '세영님',
    '의진님',
    '승수님',
    '해성님',
    '허원님',
  ];
  const bootColor = [
    { bg: 'bg-primary', text: 'text-white' },
    { bg: 'bg-success', text: 'text-white' },
    { bg: 'bg-warning', text: 'text-black' },
    { bg: 'bg-info', text: 'text-white' },
    { bg: 'alert-primary', text: 'text-black' },
    { bg: 'alert-secondary', text: 'text-black' },
    { bg: 'alert-success', text: 'text-black' },
    { bg: 'alert-danger', text: 'text-black' },
    { bg: 'alert-warning', text: 'text-black' },
    { bg: 'alert-info', text: 'text-black' },
  ];
  function pickRandomValueArr(arr) {
    const arrLength = arr.length;
    return arr[Math.floor(Math.random() * arrLength)];
  }

  const thema = pickRandomValueArr(bootColor);

  const nickname = `${pickRandomValueArr(adj)} ${pickRandomValueArr(member)}`;
  btn?.addEventListener('click', () => {
    const msg = inputEl.value;
    const data = {
      name: nickname,
      msg: msg,
      bg: thema.bg,
      text: thema.text,
    };
    socket.send(JSON.stringify(data));
    inputEl.value = '';
  });

  inputEl?.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
      btn?.click();
    }
  });
  socket.addEventListener('open', () => {
    // socket.send('안녕하세여, 저는 클라이언트에오');
  });

  const chats = [];
  //  클라이언트에게 메세지가 들어오면
  //   event.data를 보내주자.?
  /* front에 그려주는 작업 함수화시키기 */
  function drawChats(type, data) {
    if (type == 'sync') {
      // 한본에 많은 양의 데이터를 그려줘야할 때
      chatEl.innerHTML = '';
      chats.forEach(({ name, msg, bg, text }) => {
        const msgEl = document.createElement('p');
        msgEl.innerText = `${name} : ${msg}`;
        msgEl.classList.add('p-2');
        msgEl.classList.add(bg);
        msgEl.classList.add(text);
        msgEl.classList.add('fw-bod');
        msgEl.classList.add('alert');
        chatEl?.appendChild(msgEl);
        chatEl.scrollTop = chatEl?.scrollHeight - chatEl?.clientHeight;
      });
    } else if (type === 'chat') {
      const msgEl = document.createElement('p');
      msgEl.innerText = `${data.name} : ${data.msg}`;
      msgEl.classList.add('p-2');
      msgEl.classList.add(data.bg);
      msgEl.classList.add(data.text);
      msgEl.classList.add('fw-bod');
      msgEl.classList.add('alert');
      chatEl?.appendChild(msgEl);
      chatEl.scrollTop = chatEl?.scrollHeight - chatEl?.clientHeight;
    }
  }
  socket.addEventListener('message', (event) => {
    // console.log(JSON.parse(event.data));
    // data 값의 필ㅇ=드를 아레ㅐ
    // const { name, msg, bg, text } = JSON.parse(event.data);
    const msgData = JSON.parse(event.data);
    const { type, data } = msgData;

    // type이 sync일 때는 전체 data를 보여주려고,,/?
    if (type == 'sync') {
      const oldChats = data.chatsData;
      chats.push(...oldChats);
      drawChats(type, data);
    } else if (type == 'chat') {
      // 사용자가 data를 보냈을 때.
      chats.push(data); //user, bg, text, .. 정보 하나만 보내줌
      drawChats(type, data);
      // }
    }
    // console.log(name, msg);
  });
})();
