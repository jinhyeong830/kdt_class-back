// commonJS 방식으로 모듈 만들기!

const human = ['철수', '영희'];
function showName() {
  human.map((el) => console.log(el));
}

// 전체모듈 내보내기
module.exports = {
  human,
  showName,
};
