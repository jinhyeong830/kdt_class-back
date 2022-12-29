const express = require('express');

const router = express.Router();

const BLOG = [
  {
    title: 'blog1',
    content: '안녕하세요 ! ',
  },
]; //title과 content가 있는 object로 구성
// 더 하고 싶으면.. 이미지 업로드 어떻게 하는지 알아보기

/* GET      : ~/blog로 들어오면 전체 목록 조회 */
router.get('/', (req, res) => {
  const blogLength = BLOG.length;
  res.render('blog', { BLOG, blogCount: blogLength });
  //blog.ejs를 render하라는 의미 ejs템플릿을 쓴다고 선언했으니 뒤의 확장자는 생략해도 됨
  //   두번째 parameter인 {오브젝트}는 ejs에서 쓸 변수? 들을 정의해주면 됨?
});

/* GET      : /:title기준으로 특정 글 조회 */
router.get('/:title', (req, res) => {
  const blogData = BLOG.find((blo) => blo.title === req.params.title);
  if (blogData) {
    console.log(blogData);
    res.render('blogGetTitle');
  } else {
    const err = new Error('blog title NOT Found');
    err.statusCode = 404;
    throw err;
  }
});

/* POST     : 새 글 작성 */
router.post('/', (req, res) => {
  if (Object.keys(req.query).length >= 1) {
    if (req.query.title) {
      const newBlogPost = {
        title: req.query.title,
        content: req.query.content,
      };
      BLOG.push(newBlogPost);
      res.redirect('/blog');
    } else {
      const err = new Error('unexpected Query');
      err.statusCode = 404;
      throw err;
    }
  } else if (req.body) {
    console.log('post되는 중..', req.body);
    console.log(req.body.title);
    console.log(req.body.content);
    const index = BLOG.findIndex((blog) => req.body.modi_title === blog.title);

    console.log('index!?', index);

    if (req.body.title && req.body.content) {
      const newBlogPost = {
        title: req.body.title,
        content: req.body.content,
      };
      BLOG.push(newBlogPost);
      res.redirect('/blog');
    } else if (req.body.modi_title && req.body.modi_content) {
      console.log('출력', req.body);
      const modiPost = {
        title: req.body.modi_title,
        content: req.body.modi_content,
      };
      BLOG[index] = modiPost;
      res.redirect('/blog');
    } else {
      const err = new Error('unexpected form data');
      err.statusCode = 404;
      throw err;
    }
  } else {
    const err = new Error('no data');
    err.statusCode = 404;
    throw err;
  }
});
/* PUT      : 기존 글 수정 params 를 이용해서 */

router.put('/:title', (req, res) => {
  const index = BLOG.findIndex((blog) => req.params.title === blog.title);

  /* QUERY  로 들어올 때!*/
  if (Object.keys(req.query).length >= 1) {
    if (req.query.title && req.query.content) {
      if (index !== -1) {
        const modiPost = {
          title: req.query.title,
          content: req.query.content,
        };
        BLOG[index] = modiPost;
        res.redirect('/blog');
      } else {
        const err = new Error('unexpected Query');
        err.statusCode = 404;
        throw err;
      }
    }
  } else {
    const err = new Error('nodata');
    err.statusCode = 404;
    throw err;
  }
});
/* DELETE   : 기존 글 삭제 */
router.delete('/:title', (req, res) => {
  const index = BLOG.findIndex((blog) => req.params.title === blog.title);
  if (index !== -1) {
    BLOG.splice(index, index + 1);
    res.redirect('/blog');
  } else {
    const err = new Error('title not found');
    err.statusCode = 404;
    throw err;
  }
});

/* modify using input */
/* GET /modi/:id */
router.get('/modi/:title', (req, res) => {
  const index = BLOG.findIndex((blog) => req.params.title == blog.title);
  const blogLength = BLOG.length;
  console.log('modify window connected');
  res.render('modi', { BLOG, blogCount: blogLength, index });
});

module.exports = router;
