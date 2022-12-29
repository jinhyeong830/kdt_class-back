/** @format */

// @ts-check

// map
const arr = [10, 20, 30, 40, 50];
for (let i = 0; i < arr.length; i++) {
  console.log('그냥 포문 사용', arr[i]);
}

for (let item of arr) {
  console.log(item);
}

arr.map(function (element, index) {
  console.log(index + '번 값은' + element);
});

arr.map((element, index) => {
  console.log('arrow function ' + index + '번 값은' + element * 2);
});

// find 요소 찾기(찾고자 하는 요소중 가장 먼저 나오는 요소1개만을 반환) /여러개 찾고 싶으면 filter메소드 사용
const result = arr.find(function (element) {
  return element === 20;
});
const result4 = arr.find((element) => {
  return element === 10;
});
console.log(result);
console.log(typeof result);
console.log(result4);
