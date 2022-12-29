/** @format */

//@ts-check

const posts = [
  { id: 1, title: '1st diary', content: 'first content' },
  {
    id: 2,
    title: '2nd diary',
    content: 'second content',
  },
  {
    id: 3,
    title: '3rd diary',
    content: 'third content',
  },
  {
    id: 4,
    title: '1st study',
    content: 'forth content',
  },
];
const http = require('http');
const PORT = 4000;
const server = http.createServer((req, res) => {
  //들어온 url을 슬래시를 기준으로 자르기 : id확인때문..
  //삼항연산자 url이 있다면, split메소드 이용해서 자르고, 없으면 빈 배열 반환
  const urlArr = req.url ? req.url.split('/') : [];
  //urlArr엔 []
  let id = -1;

  console.log(urlArr);
  console.log(req.url);
  //id가 있다면
  if (urlArr.length > 2) {
    //id라는 변수에 url의 id를 넣어줌.
    id = parseInt(urlArr[2], 10);
  }

  //COMMON(no request id) :req.url과 req.method를 이용해서 분기 생성
  //when server request id: id!==-1 일때를 사용해서 분기 생성
  if (req.method == 'GET' && req.url === '/posts') {
    /* 전체 목록 읽기 */
    console.log('블로그 전체 글 불러오기 API');

    //핵심 result
    const result = {
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content, //object 형으로 return해주는 것.. 앞의 id는 보여줄 id라는 글자 자체이고 뒤의 post.id 는 post변수가 posts오브젝트에서 찾아낸 id값을 id에 대입해주는 것
      })),
      totalCount: posts.length,
    }; //코드

    res.setHeader('Content-Type', 'application/json; charset=utf8');
    res.statusCode = 200;
    res.end(JSON.stringify(result));
  } else if (req.method == 'GET' && id !== -1) {
    /* 특정 id의 글 읽기 */
    const result = posts.find((post) => post.id === id); //!!! find 메소드 이용해서 id에 해당하는 오브젝트 자체를 찾아줌
    res.setHeader('Content-Type', 'application/json; charset-utf8');

    if (result) {
      /* result가 true일 때! */
      res.statusCode = 200;
      res.end(JSON.stringify(result));
    } else {
      /* result가 false, 즉 undefined */
      res.statusCode = 404;
      res.end(console.error());
    }
  } else if (req.method == 'POST' && req.url === '/posts') {
    req.setEncoding('utf-8');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 200;
    res.end('upload New post!');
    console.log('새 글이 올라갔어요');
    req.on('data', (data) => {
      //data가 오면 실행되는 메소드 on?
      const newPost = JSON.parse(data);
      console.log('data', data, typeof data); //data는 string
      console.log('newPost', newPost, typeof newPost); //newPost는 object

      posts.push({
        id: posts[posts.length - 1].id + 1,
        title: newPost.title,
        content: newPost.content,
      }); //새로운 object
    });
  } else if (req.method === 'PUT' && id !== -1) {
    /* 특정 id의 글 수정 */
    req.setEncoding('utf-8');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 200;
    res.end('update post');
    console.log(`${id}번글이 수정되었어요!`);

    const result = posts.find((post) => {
      id === post.id;
    }); //id에해당하는 object를 찾아!
    req.on('data', (data) => {
      const modify = JSON.parse(data);
      modify.id = id;
      posts[id - 1] = modify;
    });
  } else if (req.method === 'DELETE' && id !== -1) {
    /* 특정 id의 글 삭제 */

    res.setHeader('Content-Type', 'application.json; charset=utf-8');
    res.statusCode = 200;
    res.end('delete Post');
    console.log(`${id}번 글이 삭제되어써요`);

    posts.splice(id - 1, 1);
  } else {
    /*  위의 어떤 분기에도 해당하지 않을 때 잘못된 url이라고 404 전송*/
    res.statusCode = 404;
    res.end('NOT FOUND');
    console.log('not found');
  }
});

server.listen(PORT, () => {
  console.log(`${PORT}번에서 실행중...`);
});
