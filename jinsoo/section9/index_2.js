const { find, go, pipe, map, L, take, reduce, curry, filter } = require("./fx");
const log = console.log;

//* 지연된 함수열을 병렬적으로 평가하기 - C.reduce, C.take
const C = {};
function noop() {}
const catchNoop = ([...arr]) => (
  arr.forEach((a) => (a instanceof Promise ? a.catch(noop) : a)), arr
);

C.reduce = curry((f, acc, iter) =>
  iter ? reduce(f, acc, catchNoop(iter)) : reduce(f, catchNoop(acc))
);

C.take = curry((l, iter) => take(l, catchNoop(iter)));

C.takeAll = C.take(Infinity);

C.map = curry(pipe(L.map, C.takeAll));

C.filter = curry(pipe(L.filter, C.takeAll));

const delay500 = (a, name) =>
  new Promise((resolve) => {
    console.log(`${name}: ${a}`);
    setTimeout(() => resolve(a), 100);
  });
// console.time("");
// go(
//   [1, 2, 3, 4, 5],
//   L.map((a) => delay500(a * a)),
//   L.filter((a) => a % 2),
//   reduce((a, b) => a + b),
//   log,
//   (_) => console.timeEnd("")
// );

// console.time("");
// go(
//   [1, 2, 3, 4, 5],
//   L.map((a) => delay500(a * a)),
//   L.filter((a) => a % 2),
//   C.reduce((a, b) => a + b),
//   log,
//   (_) => console.timeEnd("")
// );

// console.time("");
// go(
//   [1, 2, 3, 4, 5, 6, 7, 8, 9],
//   C.map((a) => delay500(a * a)),
//   L.filter((a) => delay500(a % 2)),
//   L.map((a) => delay500(a * a)),
// //   C.take(2),
//   C.reduce((a, b) => a + b),
//   log,
//   (_) => console.timeEnd("")
// );

//* 즉시 병렬적으로 평가하기 - C.map, C.filter
// C.map(a => delay500(a * a), [1, 2, 3, 4])
// C.filter((a) => delay500(a % 2), [1, 2, 3, 4]).then(log);

//* 즉시, 지연, Promise, 병렬적 조합하기
// console.time("");
// go(
//   [1, 2, 3, 4, 5, 6, 7, 8],
//   map((a) => delay500(a * a, "map 1")),
//   filter((a) => delay500(a % 2, "filter 2")),
//   map((a) => delay500(a + 1, "map 3")),
//   take(2),
//   //   C.reduce((a, b) => a + b),
//   log,
//   (_) => console.timeEnd("")
// );

// console.time("");
// go(
//   [1, 2, 3, 4, 5, 6, 7, 8],
//   L.map((a) => delay500(a * a, "map 1")),
//   L.filter((a) => delay500(a % 2, "filter 2")),
//   L.map((a) => delay500(a + 1, "map 3")),
//   take(2),
//   //   C.reduce((a, b) => a + b),
//   log,
//   (_) => console.timeEnd("")
// );

console.time("");
go(
  [1, 2, 3, 4, 5, 6, 7, 8],
  C.map((a) => delay500(a * a, "map 1")),
  L.filter((a) => delay500(a % 2, "filter 2")),
  C.map((a) => delay500(a + 1, "map 3")),
  C.take(2),
  //   C.reduce((a, b) => a + b),
  log,
  (_) => console.timeEnd("")
);
