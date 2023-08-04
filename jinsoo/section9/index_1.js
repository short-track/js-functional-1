const { find, go, pipe, map, L, take, reduce } = require("./fx");
const log = console.log;

go(
  [Promise.resolve(1), 2, 3], //? Promise.resolve(1)과 같은 값을 넣으면 올바른 결과를 얻을 수 없다.
  L.map((a) => a + 10),
  take(2),
  log
);

//* 아래와 같이 go1를 쓰면 됨
// L.map = curry(function* (f, iter) {
//     for (const a of iter) {
//       yield f(a);
//     }
//   });

//* take 변경 (Promise를 받았을 때 처리)
// const take = curry((l, iter) => {
//     let res = [];
//     iter = iter[Symbol.iterator]();
//     return (function recur() {
//       let cur;
//       while (!(cur = iter.next()).done) {
//         const a = cur.value;
//         if (a instanceof Promise)
//           return a.then((a) => ((res.push(a), res).length == l ? res : recur()));
//         res.push(a);
//         if (res.length == l) return res;
//       }
//       return res;
//     })();
//   });

go(
  [Promise.resolve(1), 2, 3],
  map((a) => Promise.resolve(a + 10)),
  log
);

//* Kleisli Composition - L.map, filter, nop, take
go(
  [1, 2, 3, 4],
  L.map((a) => Promise.resolve(a * a)),
  L.filter((a) => a % 2),
  take(2),
  log
);

//? filter도 Promise를 받을 수 있게 변경

// const nop = Symbol("nop");

// L.filter = curry(function* (f, iter) {
//   for (const a of iter) {
//     const b = go1(a, f);
//     if (b instanceof Promise)
//       yield b.then((b) => (b ? a : Promise.reject(nop)));
//     if (b) yield a;
//   }
// });

// const take = curry((l, iter) => {
//     let res = [];
//     iter = iter[Symbol.iterator]();
//     return (function recur() {
//       let cur;
//       while (!(cur = iter.next()).done) {
//         const a = cur.value;
//         if (a instanceof Promise) {
//           return a
//             .then((a) => ((res.push(a), res).length == l ? res : recur()))
//             .catch((e) => (e == nop ? recur() : Promise.reject(e)));
//         }
//         res.push(a);
//         if (res.length == l) return res;
//       }
//       return res;
//     })();
//   });

go(
  [1, 2, 3, 4, 5, 6],
  L.map((a) => Promise.resolve(a * a)),
  L.filter((a) => a % 2),
  L.map((a) => a * a),
  take(4),
  log
);

//* reduce에서 nop 지원
go(
  [1, 2, 3, 4, 5, 6],
  L.map((a) => Promise.resolve(a * a)),
  L.filter((a) => Promise.resolve(a % 2)),
  reduce((a, b) => a + b),
  log
);

//   const reduceF = (acc, a, f) =>
//   a instanceof Promise
//     ? a.then(
//         (a) => f(acc, a),
//         (e) => (e == nop ? acc : Promise.reject(e))
//       )
//     : f(acc, a);

// const reduce = curry((f, acc, iter) => {
//   if (!iter) {
//     iter = acc[Symbol.iterator]();
//     acc = iter.next().value;
//   } else {
//     iter = iter[Symbol.iterator]();
//   }
//   return go1(acc, function recur(acc) {
//     let cur;
//     acc = f(acc, a);
//     acc = reduceF(acc, cur.value, f);
//     while (!(cur = iter.next()).done) {
//       if (acc instanceof Promise) return acc.then(recur);
//     }
//     return acc;
//   });
// });

go(
  [1, 2, 3, 4, 5, 6, 7, 8],
  L.map(a => new Promise(resolve => setTimeout(() => resolve(a * a), 1000))),
  L.filter((a) => a % 2),
  take(2), //? 지연평가를 사용해서 take하는 갯수만큼만 실행
  log
);
