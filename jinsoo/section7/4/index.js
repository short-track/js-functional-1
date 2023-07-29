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
  flatten,
  map,
} = require('./fx');
const log = console.log;

//* L.flatMap
log(
  [
    [1, 2],
    [3, 4],
    [5, 6, 7],
  ].flatMap((a) => a)
);
log(
  [
    [1, 2],
    [3, 4],
    [5, 6, 7],
  ].flatMap((a) => a.map((a) => a * a))
);
log(
  flatten(
    [
      [1, 2],
      [3, 4],
      [5, 6, 7],
    ].map((a) => a.map((a) => a * a))
  )
);

L.flatMap = curry(pipe(L.map, L.flatten));
const flatMap = curry(pipe(L.map, flatten));

var it = L.flatMap(
  (a) => a,
  [
    [1, 2],
    [3, 4],
    [5, 6, 7],
  ]
);
log([...it]);

log(
  flatMap(
    (a) => a,
    [
      [1, 2],
      [3, 4],
      [5, 6, 7],
    ]
  )
);

log(
  flatMap(
    L.range,
    map((a) => a + 1, [1, 2, 3])
  )
);

console.clear();
var it = L.flatMap(
  L.range,
  map((a) => a + 1, [1, 2, 3])
);
log(it.next());
log(it.next());
log(it.next());
log(it.next());

console.clear();
log(
  take(
    3,
    L.flatMap(
      L.range,
      map((a) => a + 1, [1, 2, 3])
    )
  )
);

//* 2차원 배열 다루기
console.clear();

const arr = [
  [1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [9, 10],
];

const add = (a, b) => a + b;

go(
  arr,
  L.flatten,
  L.filter((a) => a % 2),
  L.map((a) => a * a),
  take(4),
  reduce(add),
  log
);

//* 지연성 / 이터러블 중심 프로그래밍 실무적인 코드
console.clear();
const users = [
  {
    name: 'a',
    age: 21,
    family: [
      { name: 'a1', age: 53 },
      { name: 'a2', age: 47 },
      { name: 'a3', age: 16 },
      { name: 'a4', age: 15 },
    ],
  },
  {
    name: 'b',
    age: 24,
    family: [
      { name: 'b1', age: 58 },
      { name: 'b2', age: 51 },
      { name: 'b3', age: 19 },
      { name: 'b4', age: 22 },
    ],
  },
  {
    name: 'c',
    age: 31,
    family: [
      { name: 'c1', age: 64 },
      { name: 'c2', age: 62 },
    ],
  },
  {
    name: 'd',
    age: 20,
    family: [
      { name: 'd1', age: 42 },
      { name: 'd2', age: 42 },
      { name: 'd3', age: 11 },
      { name: 'd4', age: 7 },
    ],
  },
];

go(
  users,
  L.flatMap((u) => u.family),
  L.filter((u) => u.age > 20),
  L.map((u) => u.age),
  take(4),
  reduce(add),
  log
);
