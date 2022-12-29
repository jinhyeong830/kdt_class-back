/**
 * @format
 * @typedef Post
 * @property {number} id
 * @property {string} title
 * @property {string} content
 */

/** @type {Post[]} */
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

const routes = [
  {
    /* 1. read>> GET 전체 목록 보여주기 API*/
    url: '/posts',
    method: 'GET',
    id: 'undefined',
    callback: async () => ({
      statusCode: 200, //head?
      body: {
        posts: posts.map((post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
        })),
        totalcount: posts.length,
      },
    }),
  },

  {
    /* 2. read>>   GET 특정 id의 글 보여주기 API */
    url: '/posts',
    method: 'GET',
    id: 'number',
    callback: async (postId) => {
      // const id=postId;
      if (!postId) {
        return {
          statusCode: 404,
          body: 'ID BLANK',
        };
      }
      /* url의 id를 찾아서 그 id에 해당하는 object를 result값에 넣어줌 */
      const result = posts.find((post) => post.id === postId);
      if (!result) {
        return {
          statusCode: 404,
          body: 'ID NOT FOUND',
        };
      }
      return {
        statusCode: 200,
        body: result,
      };
    },
  },

  {
    /* 3. create>> POST 새로운 id생성해서 글 추가 API */
    url: '/posts',
    method: 'POST',
    id: 'undefined',
    callback: async (id, newPost) => {
      posts.push({
        id: posts[posts.length - 1].id + 1,
        title: newPost.title,
        content: newPost.content,
      });
      return {
        statusCode: 200,
        body: 'POST IS UPLOADED!',
      };
    },
  },
  {
    /* 4. update>> PUT 특정 id의 글 수정 API */
    url: '/posts',
    method: 'PUT',
    id: 'number',
    callback: async (id, newPost) => {
      if (!id) {
        return {
          statusCode: 404,
          body: 'BLANK ID',
        };
      }
      const result = posts.find((post) => post.id === id);

      if (!result) {
        return {
          statusCode: 404,
          body: 'ID NOT FOUND',
        };
      }

      const modiPost = newPost;
      modiPost.id = id;
      posts[id - 1] = modiPost;
      return {
        statusCode: 200,
        body: modiPost,
      };
    },
  },
  {
    /* 5. delete>> DELETE 특정 id의 글 삭제 API */
    url: '/posts',
    method: 'DELETE',
    id: 'number',
    callback: async (id) => {
      if (!id) {
        return {
          statusCode: 404,
          body: 'BLANK ID',
        };
      }
      const result = posts.find((post) => post.id === id);

      if (!result) {
        return {
          statusCode: 404,
          body: 'ID NOT FOUND',
        };
      }

      posts.splice(id - 1, 1);
      return {
        statusCode: 200,
        body: 'POST IS DELETED',
      };
    },
  },
];

//routes변수를 module로서 exports하겠다는 의미

module.exports = {
  routes,
};
