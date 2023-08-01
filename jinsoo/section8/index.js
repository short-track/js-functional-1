const { find, go, pipe } = require("./fx");
const log = console.log;

//* callback Pattern
function add10(a, callback) {
  setTimeout(() => {
    callback(a + 10);
  }, 100);
}

var a = add10(5, (res) => {
  add10(res, (res) => {
    add10(res, (res) => {
      // log(res);
    });
  });
});

log(a); // undefined
// add10(5, _ => +); // undefined
//* Promise
var b = function add20(a) {
  return new Promise((resolve) => setTimeout(() => resolve(a + 20), 100));
};

log(b); // Promise <pending>
// add20(5, _ => +); // Promise <pending> | Promiser가 return 됨
// var c = add20(5, _ => +); //! <- 비동기 상황이 값(일급)으로써 다뤄진다.
// c.then(a => a - 5); ...
// add20(5).then(add20).then(add20).then(log);

//? Promise를 callback hell를 해결하기 위한 것으로 많이 설명되는데 그거보단
//? 일급으로 비동기 상황을 일급값으로 다룬다는 점에서 callback과 큰 차이가 있다.
//? Promise는 대기와 실패와 성공을 다루는 일급 값으로 이루어져있다. (callback과의 차이)
//? add10 함수는 변수에 담아도 아무것도 못하지만, add20은 어떠한 것을 할 수 있다.
console.clear();

//* 일급 활용
// const go1 = (a, f) => f(a);
const add5 = (a) => a + 5;
// log(go1(10, add5)); //? 이게 잘 동작하기 위해선 a는 알 수 있는 값, f는 동기(Promise가 아닌 값)여야한다.
// log(go1(Promise.resolve(10), add5)); // 안됨

const delay100 = (a) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(a);
    }, 100)
  );

// log(go1(delay100(10), add5)); // 안됨x

//go1 변환
const go1 = (a, f) => (a instanceof Promise ? a.then(f) : f(a));
// log(go1(delay100(10), add5)); // 됨

const n1 = 10;
go1(go1(n1, add5), log);

const n2 = delay100(10);
go1(go1(n2, add5), log);

//* Composition
//? f . g
//? f(g(x))

//? 모나드란? 함수 합성을 안전하게 하기 위한 도구

// ex
const g = (a) => a + 1;
const f = (a) => a * a;
f(g(1));
f(g()); // 안전하지 않음

// 모나드 적용 ex
[1]
  .map(g)
  .map(f)
  .forEach((r) => log(r));

[]
  .map(g)
  .map(f)
  .forEach((r) => log(r)); // 아무일도 없었다. 안전~

//? Promise는 어떠한 함수를 합성하나
Array.of(1)
  .map(g)
  .map(f)
  .forEach((r) => log(r));

Promise.resolve(2)
  .then(g)
  .then(f)
  .then((r) => log(r));
//! Promise는 비동기적으로 일어나는 상황을 안전하게 합성하기 위한 도구

// 아래코드에서 NaN이 나지만 Promise는 안에 어떤 값이 있는지에 대한 관점에서 안전한 합성을 하려는 게 아니라
// 비동기 상황에 합성을 안전하게 하려는 것임
Promise.resolve()
  .then(g)
  .then(f)
  .then((r) => log(r));

new Promise((resolve) =>
  setTimeout(() => {
    resolve(2);
  }, 100)
)
  .then(g)
  .then(f)
  .then((r) => log("setTime", r));

//* Kleisli Composition
//? 오류가 있을 수 있는 상황에서의 합수 합성을 안전하게 하는 하나의 규칙
// f . g
// f(g(x)) = f(g(x))

//? 만약 g에서 에러가 나면 아래와 같이 만드는 것이 Kleisli Composition
// f(g(x)) = g(x)

console.clear();

(() => {
  const users = [
    { id: 1, name: "aa" },
    { id: 2, name: "bb" },
    { id: 3, name: "cc" },
  ];

  const getUserById = (id) =>
    find((u) => u.id == id, users) || Promise.reject("없어요!");

  const f = ({ name }) => name;
  const g = getUserById;

  // const fg = (id) => f(g(id));
  // log(fg(2));

  // const r = fg(2);
  // users.pop();
  // users.pop();

  // const r2 = fg(2); //! Error

  //? f,g는 각각 잘 작동하는 함수지만 f.g를 합성하면 위험한 상황이 생길 수 있다.
  //? f 함수는 name이 있을 때, g도 id가 있을 때 정상적으로 동작하기 때문

  //* Kleisli Composition 합성
  const fg = (id) =>
    Promise.resolve(id)
      .then(g)
      .then(f)
      .catch((a) => a);

  fg(2).then(log);

  setTimeout(function () {
    users.pop();
    users.pop();
    fg(2).then(log);
  }, 10);
})();

//* go, pipe, reduce에서 비동기 제어
(() => {
  // const go1 = (a, f) => (a instanceof Promise ? a.then(f) : f(a));
  // const reduce = curry((f, acc, iter) => {
  //   if (!iter) {
  //     iter = acc[Symbol.iterator]();
  //     acc = iter.next().value;
  //   } else {
  //     iter = iter[Symbol.iterator]();
  //   }
  //   return (function recur(acc) {
  //     let cur;
  //     while (!(cur = iter.next()).done) {
  //       const a = cur.value;
  //       acc = f(acc, a);
  //       // acc = acc instanceof Promise ? acc.then((acc) => f(acc, a)) : f(acc, a);
  //       if (acc instanceof Promise) return acc.then(recur);
  //     }
  //     return acc;
  //   })();
  // });

  go(
    1, // Promise.resolve(1)도 되게 하고 싶다. go1 함수 추가
    (a) => a + 10,
    (a) => Promise.resolve(a + 100), // Promise.reject('error~') 처리도 하고 싶다.
    (a) => a + 1000,
    (a) => a + 10000,
    log
  );

  go(
    1, // Promise.resolve(1)도 되게 하고 싶다. go1 함수 추가
    (a) => a + 10,
    (a) => Promise.reject("error~"), // Promise.reject('error~') 처리도 하고 싶다.
    (a) => a + 1000,
    (a) => a + 10000,
    log
  ).catch((a) => log(a));
})();

//* promise.then의 중요한 규칙
(() => {
  Promise.resolve(Promise.resolve(Promise.resolve(1))).then(log);

  new Promise(resolve => resolve(new Promise(resolve => resolve(1)))).then(log);
  //? 아무리 Promise가 중첩된다고 하더라도 내가 원하는 곳에서 then으로 꺼내 쓸 수 있다.
})();
