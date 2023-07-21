const log = console.log;

// for in
// 객체의 속성을 나열
// 객체의 키값을 나열
// for in 루프에서 index 값에 할당되는 것은 숫자가 아니라 문자열('0', '1', ....)이다. 
// 게다가 이 루프는 배열의 인덱스만 순회하는 것이 아니라, 프로토타입 체인을 포함한 모든 속성을 순회한다. 원래 for in은 배열이 아니라 객체를 순회하기 위해서 만들어진 루프다.


// ## 기존과 달라진 ES6에서의 리스트 순회
// - for i++
// - for of


  const list = [1, 2, 3];
  for (var i = 0; i < list.length; i++) {
    // log(list[i]);
  }
  const str = 'abc';
  for (var i = 0; i < str.length; i++) {
    // log(str[i]);
  }
  for (const a of list) {
    // log(a);
  }
  for (const a of str) {
    // log(a);
  }


// ### Array를 통해 알아보기


  log('Arr -----------');
  const arr = [1, 2, 3];
  let iter1 = arr[Symbol.iterator]();
  for (const a of iter1) log(a);


// ### Set을 통해 알아보기


  log('Set -----------');
  const set = new Set([1, 2, 3]);
  for (const a of set) log(a);


// ### Map을 통해 알아보기


  log('Map -----------');
  const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
  for (const a of map.keys()) log(a);
  for (const a of map.values()) log(a);
  for (const a of map.entries()) log(a);
  console.clear();

// 그렇다면 '순회가능한' 객체란 무엇일까? 바로 Symbol.iterator 심볼을 속성으로 가지고 있고, 이터레이터 객체를 반환하는 객체를 뜻한다.
//
// ## 이터러블/이터레이터 프로토콜
// - 이터러블: 이터레이터를 리턴하는 [Symbol.iterator]() 를 가진 값
// - 이터레이터: { value, done } 객체를 리턴하는 next() 를 가진 값
// - 이터러블/이터레이터 프로토콜: 이터러블을 for...of, 전개 연산자 등과 함께 동작하도록한 규약

// ### 사용자 정의 이터러블을 통해 알아보기


  const iterable = {
    [Symbol.iterator]() {
      let i = 3;
      return {
        next() {
          return i == 0 ? {done: true} : {value: i--, done: false};
        },
        [Symbol.iterator]() {
          return this;
        }
      }
    }
  };
  let iterator = iterable[Symbol.iterator]();
  iterator.next();
  iterator.next();
  // log(iterator.next());
  // log(iterator.next());
  // log(iterator.next());
  for (const a of iterator) log(a);

  // const arr2 = [1, 2, 3];
  // let iter2 = arr2[Symbol.iterator]();
  // iter2.next();
  // log(iter2[Symbol.iterator]() == iter2);
  // for (const a of iter2) log(a);

  for (const a of document.querySelectorAll('*')) log(a);
  const all = document.querySelectorAll('*');
  let iter3 = all[Symbol.iterator]();
  log(iter3.next());
  log(iter3.next());
  log(iter3.next());


// ## 전개 연산자


  console.clear();
  const a = [1, 2];
  // a[Symbol.iterator] = null;
  log([...a, ...arr, ...set, ...map.keys()]);

