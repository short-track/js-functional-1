const log = console.log;

(() => {
  log('***********************************');
  log('Arr -----------');
  const arr = [1, 2, 3];
  let iter1 = arr[Symbol.iterator]();
  iter1.next();
  for (const a of iter1) log(a);

  //! - 이터러블: 이터레이터를 리턴하는 [Symbol.iterator]() 를 가진 값
  log(arr[Symbol.iterator]);
  let iterator = arr[Symbol.iterator]();
  //! - 이터레이터: { value, done } 객체를 리턴하는 next() 를 가진 값
  log(iterator.next());
  log(iterator.next());
  log(iterator.next());
  log(iterator.next());
})();

//* - 이터러블/이터레이터 프로토콜: 이터러블을 for...of, 전개 연산자 등과 함께 동작하도록한 규약
//? ex for ... of 문 같은 경우는 Array가 이터러블이고 이터레이터를 return 하기 때문에 for ... of와 함께 잘 동작하는 이터러블 객체고
//? 그래서 for ... of로 순회할 수 있기때문에 Array는 이터러블/이터레이터 프로토콜를 잘 따른다고 할 수 있다.

//? Set도 이터러블/이터레이터 프로토콜를 따르기 때문에 set[0]은 undefined지만 for ... of로 순회가능
(() => {
  log('***********************************');
  log('Set -----------');
  const set = new Set([1, 2, 3]);
  log(set[0]);
  for (const a of set) log(a);

  let a = set[Symbol.iterator]();
  log(set[0], a.next());

  log('Map -----------');
  const map = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3],
  ]);

  let b = map[Symbol.iterator]();
  log(map[0], b.next());

  //? map.keys() value에 key값만 들어간 이터레이터, value() 동일
  for (const a of map.keys()) log(a);
  for (const a of map.values()) log(a);
  for (const a of map.entries()) log(a); // === for (const a of map) log(a);

  let it = map.values();
  let it2 = it[Symbol.iterator]();
  log(it2.next());
})();

//* 사용자 정의 이터러블
//? Symbol.iterator 메소드를 구현하고 있어야한다.
//? Symbol.iterator 메소드는 이터레이터를 반환해야한다.

(() => {
  log('***********************************');
  const iterable = {
    [Symbol.iterator]() {
      let i = 3;
      return {
        next() {
          return i == 0 ? { done: true } : { value: i--, done: false };
        },
      };
    },
  };

  let iterator = iterable[Symbol.iterator]();
  log(iterator.next());

  for (const a of iterable) log(a);
  // for (const a of iterator) log(a); // Error

  //? 완벽 구현은 안되었음
  //? 이터레이터가 자기 자신을 반환하는 Symbol.iterator 메소드를 가지고 있을 때 Well formed iterator / iterable이라고 할 수 있음
  const arr2 = [1, 2, 3];
  let iter2 = arr2[Symbol.iterator]();
  iter2.next();
  log(iter2[Symbol.iterator]() == iter2); //! 이 부분이 직접 구현한 것과 다르다
})();

(() => {
  //! Well-formed iterator
  //* 자기 자신을 반환한다
  const iterable = {
    [Symbol.iterator]() {
      let i = 3;
      return {
        next() {
          return i == 0 ? { done: true } : { value: i--, done: false };
        },
        [Symbol.iterator]() {
          return this;
        },
      };
    },
  };
  let iterator = iterable[Symbol.iterator]();
  log(iterator === iterator[Symbol.iterator]());
})();

// (() => {
//   //* iterable임 html이 아니라 error
//   for (const a of document.querySelectorAll('*')) log(a);
//   const all = document.querySelectorAll('*');
//   let iter3 = all[Symbol.iterator]();
//   log(iter3.next());
//   log(iter3.next());
//   log(iter3.next());
// })();

(() => {
  console.clear();
  const a = [1, 2];
  // a[Symbol.iterator] = null; //* iterable이 이니다라는 Error 뜸
  //? 전개 연산자 역시 이터러블 프로토콜을 따르는 값들을 펼칠 수 있는 것이다
  //? map, set, arr 다 전개 연산자 사용 가능
  log([...a, ...[3, 4]]);
})();
