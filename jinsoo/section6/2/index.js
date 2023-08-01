const { curry, map, filter, reduce, go, pipe, range, take } = require("./fx");
const log = console.log;

//* 이터러블 중심 프로그래밍에서의 지연 평가
//* 느긋한 = 영리한

const L = {};

//* L.map
(() => {
  L.map = function* (f, iter) {
    for (const a of iter) yield f(a);
  };
  var it = L.map((a) => a + 10, [1, 2, 3]);
  log(it.next());
  log(it.next());
  log(it.next());
  console.clear();
})();

//* L.filter
(() => {
  L.filter = function* (f, iter) {
    for (const a of iter) if (f(a)) yield a;
  };
  var it = L.filter((a) => a % 2, [1, 2, 3, 4]);
  log(it.next());
  log(it.next());
  log(it.next());
  console.clear();
})();

//* range, map, filter, take, reduce 중첩 사용
(() => {
  console.time("");
  go(
    range(100000),
    map((n) => n + 10),
    filter((n) => n % 2),
    take(10),
    log
  );
  console.timeEnd("");

  //* 실행 순서
  // [0, 1, 2, 3, 4, 5, 6, 7, 8...]
  // [10, 11, 12, ...]
  // [11, 13, 15 ..]
  // [11, 13]
})();

//* L.range, L.map, L.filter, take, reduce 중첩 사용
(() => {
  L.range = function* (l) {
    let i = -1;
    while (++i < l) {
      yield i;
    }
  };

  L.map = curry(function* (f, iter) {
    iter = iter[Symbol.iterator]();
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      yield f(a);
    }
  });

  L.filter = curry(function* (f, iter) {
    iter = iter[Symbol.iterator]();
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      if (f(a)) {
        yield a;
      }
    }
  });

  console.time("L");
  go(
    L.range(Infinity),
    L.map((n) => n + 10),
    L.filter((n) => n % 2),
    take(10),
    log
  );
  console.timeEnd("L");

  //* 실행 순서
  // 0      1
  // 10     11
  // false  true
  // 0으로 map -> filter -> take 그다음 1로 map -> filter -> take 
})();

//* map, filter 계열 함수들이 가지는 결합 법칙

  // [0      [1
  // 10       11
  // false]   true]

//*  - 사용하는 데이터가 무엇이든지
//*  - 사용하는 보조 함수가 순수 함수라면 무엇이든지
//*  - 아래와 같이 결합한다면 둘 다 결과가 같다.

//*  [[mapping, mapping], [filtering, filtering], [mapping, mapping]]
//*  =
//*  [[mapping, filtering, mapping], [mapping, filtering, mapping]]

//* ES6이전에는 다른 방법을 써서 위와 같은 방식을 구현했으나
//* ES6의 규약을 활용해서 내가 원하는 시점에 지연 평가를 할 수 있게 되었다!