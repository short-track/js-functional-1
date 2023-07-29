const {
  L,
  curry,
  filter,
  reduce,
  go,
  pipe,
  range,
  take,
  takeAll,
} = require('./fx');
const log = console.log;

//* L.flatten
log([...[1, 2], 3, 4, ...[5, 6], ...[7, 8, 9]]);

const isIterable = (a) => a && a[Symbol.iterator];

L.flatten = function* (iter) {
  for (const a of iter) {
    if (isIterable(a)) for (const b of a) yield b;
    else yield a;
  }
};

const it = L.flatten([[1, 2], 3, 4, [5, 6], [7, 8, 9]]);
log(it.next());
log(it.next());
log(it.next());
log(it.next());
log(take(6, L.flatten([[1, 2], 3, 4, [5, 6], [7, 8, 9]])));

const flatten = pipe(L.flatten, takeAll);
log(flatten([[1, 2], 3, 4, [5, 6], [7, 8, 9]]));

//* yield *iterable은 for (const val of iterable) yield val와 같다.

// L.flatten = function *(iter) {
//   for (const a of iter) {
//     if (isIterable(a)) yield *a;
//     else yield a;
//   }
// };

L.deepFlat = function* f(iter) {
  for (const a of iter) {
    if (isIterable(a)) yield* f(a);
    else yield a;
  }
};
log([...L.deepFlat([1, [2, [3, 4], [[5]]]])]);
