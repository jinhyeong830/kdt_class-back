/** @format */

const http = require('http');
const { routes } = require('./route');

const server = http.createServer((req, res) => {
  /* req.url에서 id만 뽑기 */
  const urlArr = req.url ? req.url.split('/') : [];
  let id;
  if (urlArr.length > 2) {
    id = parseInt(urlArr[2], 10);
  } else {
    id = undefined;
  }

  /* 비동기 -->동기 */
  //   why?
  async function main() {
    /* route 모듈의 routes에서 아래에 해당하는 API 오브젝트를 찾아서 
    route변수에 넣어준다! */
    const route = routes.find(
      (_route) =>
        req.url &&
        req.method &&
        req.url.search(_route.url) !== -1 &&
        _route.method === req.method &&
        typeof id === _route.id

      /* 조건!
    1) req.url이 존재할 때
    2) req.method가 존재할때
    3) route모듈의 url이 존재할 때
    4) route모듈의 메소드와 req의 메소드가 같을 때
    5) id의 타입과 route의 id가 같을 때
    5-1) route의 id는 'number' 'undefined' 등으로 정의 되어 있고
        실제 req의 id는 1,2.. 등의 실제 number형 변수로 정의되어있기 때문에
        id의 타입과 route모듈의 id를 비교해야 함!!
     */
    );

    res.setHeader('Content-Type', 'application/json; utf-8');

    /* find method로 조건에 맞는 route를 못찾았을 때 */
    if (!route) {
      console.log('해당 API를 찾을 수 없습니다.');
      res.end('FAULT ROUTE');
      res.statusCode = 404;
    } else {
      let newPost;
      if (req.method === 'POST' || req.method === 'PUT') {
        //await 1
        newPost = await new Promise((resolve, reject) => {
          req.setEncoding('utf-8');
          req.on('data', (data) => {
            if (data !== undefined) {
              resolve(JSON.parse(data));
            } else {
              reject();
            }
          });
        });
      }
      //await 2
      const result = await route.callback(id, newPost);
      console.log('result:', result);

      res.statusCode = result.statusCode;
      res.end(JSON.stringify(result.body));
    }
  }

  //async로 함수를 선언해주면 익명함수로 선언할 수 없어서 호출을 해줘야함
  main();
});
/* 서버열기 */
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`${PORT} port server is opened!!!`);
});
