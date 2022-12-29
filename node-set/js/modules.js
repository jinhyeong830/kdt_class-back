// @ts-check

// const animals = require('./animals');

// console.log(animals.animals);

// import { animals, showAnimals } from './animals.js';

// import * as animals from './animals.js';

/* console.log(animals);
animals.showAnimals(); */

/* import { animals as ani, showAnimals as show } from './animals.js';

console.log(ani);
console.log(show); */

import Animal from './animals.js';
// 중괄호가 없다? class를 모듈화 시켜서 가져왔다고 생각하묜 됨
// export default

const ani = new Animal();
console.log(ani);
ani.showAnimals();
