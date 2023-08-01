// iterable / iterator 개념
// - iterable: [Symbol.iterator] 메서드를 갖고 있는 값. [Symbol.iterator] 메서드는 iterator 를 리턴.
// - iterator: next 메서드를 갖고 있는 값. next 메서드는 { value, done } 를 키로 갖는 객체를 리턴.
// - 이러한 형태의 iterable 과 iterator 를 갖고 있는 값을 '이터러블 프로토콜'을 따른다고 표현.
// - 이터러블 프로토콜을 따르면 for...of, 전개연산자 등을 사용할 수 있다.
// - 자바스크립트의 내장 자료구조인 array, map, set 은 모두 이터러블 프로토콜을 따르고 있다.

// 배열의 경우
const arr = [1, 2, 3];
const iter1 = arr[Symbol.iterator]();
iter1.next(); // { value: 1, done: false }
for (const a of iter1) console.log(a); // 2, 3

// Set 의 경우
const set = new Set([1, 2, 3]);
for (const b of set) console.log(b); // 1, 2, 3

// Map 의 경우
const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
for (const c of map) console.log(c); // [['a', 1], ['b', 2], ['c', 3]

// iterable 을 반환하는 keys(), values(), entries() 메서드도 구현되어 있다
for (const c of map.keys()) console.log(c);    // 'a', 'b', 'c'
for (const c of map.values()) console.log(c);  // 1, 2, 3
for (const c of map.entries()) console.log(c); // [['a', 1], ['b', 2], ['c', 3]


// 전개연산자도 사용할 수 있다
console.log(
  ...arr, ...set, ...map
);

// 따라서 세 자료구조 모두 for of 반복문이 사용 가능한 것이다.
// 만약 for of 문이 내부적으로 일반적인 반복문처럼 구현되었다면, set[0], set[1] 따위의 표현식에 값을 반환했을 것이지만 그렇게 동작하지 않는다.


// 사용자 정의 iterable
// - 위와 같은 프로토콜을 따른다면 사용자가 직접 iterable 을 구현할 수도 있다.

// 3번 반복하는 iterable 예시
const iterable = {
  // 1. iterable 은 [Symbol.iterator] 메서드를 갖고 있는 값이다. 이 메서드는 iterator 를 반환한다.
  [Symbol.iterator]() {
    let i = 3;
    return {
      next() {         // 2. iterator 는 next 메서드를 갖고 있는 값이다.
                       // next 메서드는 type iterator<T> = { value: T, done: boolean } 타입의 값을 반환한다.
        return i === 0
          ? { done: true }
          : { value: i--, done: false }
      },
      [Symbol.iterator]() {  // 3. well-formed iterator 는 다시 자신의 [Symbol.iterator] 메서드를 갖는다
        return this;         // 이 메서드는 자기 자신, 즉 iterator 를 반환한다.
      }
    }
  }
};

const iterator = iterable[Symbol.iterator]();
iterator.next(); // 3
for (const a of iterator) console.log(a); // 2, 1


