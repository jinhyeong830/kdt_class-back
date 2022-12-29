// @ts-check

/**
 * @param {string} name 문자열, 사람이름
 * @param {number} age 숫자, 나이
 * @returns {*} 얘는 이름과 나이를 받아서 문자열로 출력합니다.
 */
function hello(name, age) {
  return `my name is ${name}, and I'm ${age} years old`;
}
console.log(hello('Allie', 5));

/**
 * @typedef Post
 * @property {number} id
 * @property {string} title
 * @property {string} content
 */

/** @type {Post} */
const post = {
  id: 1,
  title: '제목',
  content: '5',
};
