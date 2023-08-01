/* range와 L.range */
// range
const range = l => {
  let i = -1;
  let res = [];
  while (++i < l) {
    res.push(i);
  }
  return res;
};

var list = range(4);
console.log(list); // [0, 1, 2, 3]
console.log(reduce(add, list));


// generator를 활용해서 지연평가되는 range 함수 구현
// L.range
const L = {};

L.range = function* (l) {
  let i = -1;
  while (++i < l) {
    yield i;
  }
};

// reduce에 들어섰을때 비로소 값으로 평가된다.
var list = L.range(4);
console.log(list);
console.log(reduce(add, list));

// range와 L.range 속도 비교
function test(name, time, f) {
  console.time(name);
  while (time--) f();
  console.timeEnd(name);
}

// test('range', 10, () => reduce(add, range(1000000)));
// test('L.range', 10, () => reduce(add, L.range(1000000)));
console.clear();


/* take */
// take 함수는 reduce와 마찬가지로 이터레이터를 반환하는 함수들의 합성의 마지막에 값으로 평가하는 함수이다.

const take = curry((l, iter) => {
  let res = [];
  for (const a of iter) {
    res.push(a);
    if (res.length == l) return res;
  }
  return res;
});

console.time('');
go(
    range(10000),
    take(5),
    reduce(add),
    log);
console.timeEnd('');

console.time('');
go(
    L.range(10000), // 지연평가
    take(5),
    reduce(add),
    log);
console.timeEnd('');


/* range, map, filter, take, reduce 중첩 사용 */

// 지연평가가 아닌 함수들, 그 함수들의 합성
const range = l => {
  let i = -1;
  let res = [];
  while (++i < l) {
    res.push(i);
  }
  return res;
};


const map = curry((f, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();     //-----|
  let cur;                            //     | 이 부분은
  while (!(cur = iter.next()).done) { //     | for (const a of iter) {} 의
    const a = cur.value;              //-----| 구현을 구체적으로 서술한 문장이다.(이해를 돕기 위함)
    res.push(f(a));
  }
  return res;
});


const filter = curry((f, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    if (f(a)) res.push(a);
  }
  return res;
});

const take = curry((l, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    res.push(a);
    if (res.length == l) return res;
  }
  return res;
});


const reduce = curry((f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  } else {
    iter = iter[Symbol.iterator]();
  }
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    acc = f(acc, a);
  }
  return acc;
});

// console.time('');
// go(range(100000),
//   map(n => n + 10),
//   filter(n => n % 2),
//   take(10),
//   log);
// console.timeEnd('');



/* L.range, L.map, L.filter, take, reduce 중첩 사용 */
//지연평가를 구현한 함수들, 그 함수들의 합성

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

// console.time('L');
// go(L.range(Infinity),
//   L.map(n => n + 10),
//   L.filter(n => n % 2),
//   take(10),
//   log);
// console.timeEnd('L');

// 1. 지연평가가 아닌 경우 평가 순서
// [0, 1, 2, 3, 4, 5, 6, 7, 8...]
// [10, 11, 12, ...]
// [11, 13, 15 ..]
// [11, 13]
// => 각각의 문장을 모두 실행한 후 다음 함수로 인자를 넘긴다. (이 경우에는 range(Infinity) 문장에서 무한루프에 빠짐)

// 2. 지연평가인 경우
// [0    [1
// 10     11
// false]  true]
// => take 함수 내부의 res의 length가 10에 도달하는 순간 루프가 종료된다

/* map, filter 계열 함수들이 가지는 결합법칙 */
// - 사용하는 데이터가 무엇이든지
// - 사용하는 보조 함수가 순수 함수라면 무엇이든지
// - 아래와 같이 결합한다면 둘 다 결과가 같다.

// [[mapping, mapping], [filtering, filtering], [mapping, mapping]]
// =
// [[mapping, filtering, mapping], [mapping, filtering, mapping]]
