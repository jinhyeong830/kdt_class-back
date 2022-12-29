// @ts-check

// 이 파일 자체가 하나의 기능을 담당하는 모듈이 될 것
/* const animals = ['dog', 'bear'];

exports.animals = animals;

function showAnimals1() {
  animals.map((el) => console.log(el));
}

exports.showAnimals = function showAnimals2() {
  animals.map((el) => console.log(el));
};
 */
// 외부 파일에서 어떤것을 사용할 수 있게 할지 exports로 => 한번에 내보내는 방법
/* module.exports = {
  animals,
  showAnimals,
}; */
/*
export const animals = ['dog', 'bear'];
export function showAnimals() {
  animals.map((el) => console.log(el));
} */

// 클래스 하나만 내보내는.
export default class Animals {
  constructor() {
    this.animals = ['dog', 'bear'];
  }

  showAnimals() {
    this.animals.map((el) => console.log(el));
  }
}
