// 결과를 만드는 함수 reduce, take
// - reduce와 take 함수는 이터레이터를 인자로 받아서 비로소 값으로 평가한다.


// queryStr 함수 만들기

L.entries = function* (obj) {
  for (const k in obj) yield [k, obj[k]];
};


// 이터러블 프로토콜을 따르는 join을 활용해 객체를 쿼리스트링으로 변환해주는 함수
const queryStr = pipe(
  L.entries,
  L.map(([k, v]) => `${k}=${v}`),
  reduce((a, b) => `${a}&${b}`)
)

// join 함수를 구현해 queryStr을 간단하게 작성할 수도 있다
// Array.prototype.join 메서드보다 다형성이 높다(이터러블이면 모두 작동하기 때문)
const join = curry((sep = ',', iter) =>
  reduce((a, b) => `${a}${sep}${b}`, iter));

const queryStr2 = pipe(
  L.entries,
  L.map(([k, v]) => `${k}=${v}`),
  join('&'));

log(queryStr({limit: 10, offset: 10, type: 'notice'}));

// 다형성이 높기 때문에 제네레이터의 반환값(=이터레이터)를 입력할 수도 있다.
function *a() {
  yield 10;
  yield 11;
  yield 12;
  yield 13;
}

log(join(' - ', a())); // 10 - 11 - 12 - 13


// take, find 함수 만들기(=take를 응용해 find 함수 만들기)
const users = [
  {age: 32},
  {age: 31},
  {age: 37},
  {age: 28},
  {age: 25},
  {age: 32},
  {age: 31},
  {age: 37}
];


// 조건에 일치하는 값 중 가장 앞서있는 값 하나를 찾는다
const find = curry((f, iter) => go(
  iter,
  L.filter(f),
  take(1),
  ([a]) => a));


log(find(u => u.age < 30)(users));

go(users,
  L.map(u => u.age),
  find(n => n < 30),
  log);


// L.map, L.filter로 map과 filter 만들기
// 1. L.map을 사용하여 map 구현
const map = curry((f, iter) => go(iter,
  L.map(f),
  take(Infinity)
));

// pipe를 사용하여 코드 줄이기
const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs); // 참고를 위한 pipe

const map = curry(pipe(L.map, take(Infinity)));
const userNames = map(u => u.name, users);


// 2. L.map을 사용하여 map 구현
const filter = (f, iter) => go(iter,
 L.filter(f),
 take(Infinity)
);

// pipe를 사용하여 코드 줄이기
const filter = curry(pipe(L.filter, take(Infinity)));


// L.flatten, flatten
// 이터러블을 펼치는 L.flatten을 만들어보자
console.log([...[1, 2], 3, 4, ...[5, 6], ...[7, 8, 9]]); // [1, 2, 3, 4, 5, 6, 7, 8, 9]

const isIterable = a => a && a[Symbol.iterator];

L.flatten = function* (iter) {
  for (const a of iter) {
    if (isIterable(a)) for (const b of a) yield b;
    else yield a;
  }
}

// array를 펼쳐서 1 depth인 배열로 만드는 예제
const it = L.flatten([[1, 2], 3, 4, [5, 6], [7, 8, 9]]);
console.log([...it]); // [1, 2, 3, 4, 5, 6, 7, 8, 9]


// 즉시평가되는 flatten도 쉽게 만들 수 있다
const flatten = pipe(L.flatten, take(Infinity));
console.log(flatten([[1, 2], 3, 4, [5, 6], [7, 8, 9]])); // [1, 2, 3, 4, 5, 6, 7, 8, 9]

// yield *을 활용하면 위 코드를 아래와 같이 변경할 수 있다.
// yield *iterable은 for (const val of iterable) yield val; 과 같다.
L.flatten = function* (iter) {
  for (const a of iter) {
    if (isIterable(a)) yield *a;
    else yield a;
  }
};

// depth가 2 이상인 iterable을 펼칠 수도 있다
// 만일 깊은 Iterable을 모두 펼치고 싶다면 아래와 같이 L.deepFlat을 구현하여 사용할 수 있습니다.
// L.deepFlat은 깊은 Iterable을 펼쳐줍니다.
// (재귀 활용)
L.deepFlat = function* f(iter) {
  for (const a of iter) {
    if (isIterable(a)) yield *f(a);
    else yield a;
  }
};

log([...L.deepFlat([1, [2, [3, 4], [[5]]]])]);
// [1, 2, 3, 4, 5];


// flatMap
// - flatMap은 map과 flatten을 동시에 수행하는 함수
// - flatMap이 필요한 이유는 자바스크립트가 기본적으로 지연적으로 동작하지 않기 때문
// - 만약 지연적으로 동작한다면 L.map과 L.flatten의 합성으로 한번에 map과 flatten을 수행하는 flatMap 함수처럼 동작할 것이기 때문이다(-> 확실하지 않음)
// javascript의 flatMap을 사용해서 로직을 만들어보자
// 안쪽에 있는 값에 하나하나 콜백함수를 적용하고 flatten 까지 적용해준다
console.log(
  [[1, 2], [3, 4], [5, 6, 7]].flatMap(a => a)), // [1, 2, 3, 4, 5, 6, 7]
  [[1, 2], [3, 4], [5, 6, 7]].flatMap(a => a.map(a => a + 10)), // [11, 12, 13, 14, 15, 16, 17]
  flatten([[1, 2], [3, 4], [5, 6, 7]].map(a => a.map(a => a * a)) // 윗줄과 동일한 효과/결과
);

// map과 flatten이 비효율적으로 동작하기 때문에 flatMap이 있는 것이다
// map이 적용될때 iterable의 각 요소에 콜백함수를 적용하고, flatten을 할때 다시 iterable을 순회하기 때문이다.


// 좀더 효율성이 있는(그리고 다형성이 높은) flatMap 구현(L.flatMap)
// 기존에 정의된 함수를 사용해서 간단하게 구현할 수 있다.

L.flatMap = curry(pipe(L.map, L.flatten));

let it = L.flatMap(map(a => a * a), [[1,2], [3,4], [5, 6, 7]]);
let it2 = pipe(
  map(a => a * a),
  L.flatMap);

console.log([...it]);                           // [1, 4, 9, 26, 25, 36, 49]
console.log([...it2([[1,2], [3,4], [5, 6, 7]])]); // [1, 4, 9, 26, 25, 36, 49]

// L.flatMap을 사용해서 flatMap 구현
const flatMap = pipe(L.flatMap, take(Infinity));

// 응용
console.log(
  flatMap(L.range, [1, 2, 3]), // [0, 0, 1, 0, 1, 2] -> (0 / 0 1 / 0 1 2)
  map(range, [1, 2, 3]), // [[0], [0, 1], [0, 1, 2]]
);


// 2차원 배열 다루기
// - flatten이나 지연적으로 동작하는 함수를 조합하여 2차원 배열을 다루는 예시
const arr = [
  [1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [9, 10]
];

// 이 예시는 지연적으로 동작한다
// 1, 2, 3, 4, 5까지만 순회한다
go(arr,
   L.flatten,
   L.filter(a => a % 2),
   take(3),
   console.log
); // 1, 3, 5


// 이터러블 중심의 실무적인 코드
// - flatten, map, filter, reduce 등이 실무적으로 어떻게 사용될 수 있는지 예제
// 이 예제와 동일한 구조의 실무적인 코드를 작성해보자
const arr = [
  [1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [9, 10]
];

go(arr,
   L.flatten,
   L.filter(a => a % 2),
   L.map(a => a * a),
   take(4),
   reduce(add),
   console.log
);

const users = [
  {
    name: 'a', age: 21, family: [
      {name: 'a1', age: 53}, {name: 'a2', age: 47},
      {name: 'a3', age: 16}, {name: 'a4', age: 15}
    ]
  },
  {
    name: 'b', age: 24, family: [
      {name: 'b1', age: 58}, {name: 'b2', age: 51},
      {name: 'b3', age: 19}, {name: 'b4', age: 22}
    ]
  },
  {
    name: 'c', age: 31, family: [
      {name: 'c1', age: 64}, {name: 'c2', age: 62}
    ]
  },
  {
    name: 'd', age: 20, family: [
      {name: 'd1', age: 42}, {name: 'd2', age: 42},
      {name: 'd3', age: 11}, {name: 'd4', age: 7}
    ]
  }
];

go(users,
  L.flatMap(u => u.family),
  L.filter(u => u.age > 20),
  L.map(u => u.age),
  take(4),
  reduce(add),
  log);
