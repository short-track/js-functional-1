// ** 기존과 달라진 ES6에서의 리스트 순회
// - for i++
// - for of

// ES5에서의 리스트 순회
const list = [1, 2, 3];
for (var i = 0; i < list.length; i++) {
  console.log(list[i]);
}

const str = "abc";
for (var i = 0; i < str.length; i++) {
  console.log(str[i]);
}

// ES6에서의 리스트 순위
for (const a of list) {
  console.log(a);
}

for (const a of str) {
  console.log(a);
}

// ** 이터러블/이터레이터 프로토콜
// - 이터러블: 이터레이터를 리턴하는 [Symbol.iterator]()를 가진 값 -> arr, set, map은 이터러블에 해당
// - 이터레이터: { value, done } 객체를 리턴하는 next()를 가진 값 -> for...of 문과 함께 동작 가능
// - 이터러블/이터레이터 프로토콜: 이터러블을 for...of, 전개 연산자 등과 함께 동작하도록 한 규약

// ** Array를 통해 알아보기
console.log("Arr ------------");
const arr = [1, 2, 3];
for (const a of arr) {
  console.log(a);
}
// 배열은 키 값으로 접근 및 조회 가능
console.log(arr[0]); // 1

const iter1 = arr[Symbol.iterator]();
iter1.next();
for (const a of iter1) {
  console.log(a);
}

// ** Set을 통해 알아보기
console.log("Set ------------");
const set = new Set([1, 2, 3]);
for (const a of set) {
  console.log(a);
}
// 키 값으로 접근 및 조회 불가
console.log(set[0]); // undefined

// ** Map을 통해 알아보기
console.log("Map ------------");
const map = new Map([
  ["a", 1],
  ["b", 2],
  ["c", 3],
]);

for (const a of map) {
  console.log(a);
}

// 키 값으로 접근 및 조회 불가 -> for문과 같은 순회 아닌 다른 방식으로 동작
console.log(map[0]); // undefined

const iter2 = map[Symbol.iterator]();
iter2.next();
iter2.next();

for (const a of iter2) {
  console.log(a); // [ 'c', 3 ]
}

// key만 뽑을 수 있는 메서드 내장
console.log(map.keys());
for (const a of map.keys()) {
  console.log(a);
}

// value만 뽑을 수 있는 메서드 내장
for (const a of map.values()) {
  console.log(a);
}

// entry만 뽑을 수 있는 메서드 내장
for (const a of map.entries()) {
  console.log(a);
}

// Symbol.iterator
// Symbol은 어떤 객체의 키로 사용 가능
console.log(arr[Symbol.iterator]); // 함수
console.log(set[Symbol.iterator]); // 함수
console.log(map[Symbol.iterator]); // 함수

// *** 사용자 정의 이터러블을 통해 알아보기
const iterable = {
  [Symbol.iterator]() {
    let i = 3;
    return {
      next() {
        return i === 0 ? { done: true } : { value: i--, done: false };
      },
      [Symbol.iterator]() {
        return this; // 자기 자신을 리턴해야 iterable로써 동작 가능
      },
    };
  },
};

let iterator = iterable[Symbol.iterator]();
// console.log(iterator.next());
// console.log(iterator.next());
// console.log(iterator.next());
// console.log(iterator.next());

for (const a of iterable) {
  // iterable에 [Symbol.iterator]()가 있기 때문에 for...of문 적용 가능
  console.log(a);
}

// 하지만 아직 이터러블/이터레이터 프로토콜로 모든 속성을 구현할 수는 없음
const arr2 = [1, 2, 3];
let iter3 = arr2[Symbol.iterator]();
// console.log(arr2[Symbol.iterator]() === arr2); // 이건 왜 false??
console.log(iter3[Symbol.iterator]() === iter3); // true
// 자기 자신과 동일할 경우, well-formed iterator라고 함

for (const a of iter3) {
  console.log(a);
}

// ES6 뿐만 아니라, 브라우저에서 사용하는 DOM과 관련된 여러 값들도 이터러블/이터레이터 프로토콜을 따르고 있다.

// for (const a of document.querySelectorAll("*")) {
//   console.log(a);
// }
// const all = document.querySelectorAll("*");
// let iter4 = all[Symbol.iterator]();
// console.log(iter4.next());
// console.log(iter4.next());
// console.log(iter4.next());
// console.log(iter4.next());

// ** 전개 연산자
// 전개 연산자도 이터러블/이터레이터 프로토콜을 따른다.
console.clear();

const a = [1, 2];
// a[Symbol.iterator] = null; // iterable 아니라고 에러

console.log([...a, ...[3, 4]]);
console.log([...a, ...arr, ...set, ...map]);
