//- calback과 Promise
// - javascript에서 비동기를 다루는 방식
// - callback
// - Promise

// callback의 경우
const add10 = (a, callback) => {
  // setTimeout을 사용한 비동기 재현
  setTimeout(() => callback(a + 10), 1000)
}

add10(5, res => {
    add10(res, res => {
      console.log(res); // 25, callback hell
  })
})

// promise의 경우
const add20 = a => new Promise(resolve => {
  setTimeout(() => resolve(a + 20), 1000)
});

const b = add20(5)
  .then(add20)
  .then(res => console.log(res)); // 25

// promise의 효용을 설명할때 then메소드를 사용해 callback hell을 만들지 않는다는 점을 위주로 드는 경향이 있다.
// 하지만 비동기상황을 코드나 context로 다루는 callback과 달리 Promise는 Promise 객체의 인스턴스라는 값으로 다룬다는 점을 아는 것이 중요하다.
// fulfilled, rejected, pending 세가지 상태로 비동기상황을 표현했다.

// 변수 a와 b의 값을 비교해보면서 그 차이점을 생각해보자.
// a: undefined, b: Promise{<pending>}

// 비동기상황을 값으로 표현한다는 것은 값을 변수에 대입할 수도 있고 함수에 넘겨줄 수도 있다는 것을 의미한다.
b.then(console.log);
// func(b);


// - 값으로서 Promise 활용
const go1 = (a, f) => f(a);
const add5 = a => a + 5;

// go1 함수는 비동기가 아닌 값을 받아야 의도대로 동작한다.
console.log(go1(10, add5)); // 15
console.log(go1(Promise.resolve(10), add5)); // '[object Promise]5'

const delay100 = a => new Promise(resolve =>
  setTimeout(() => resolve(a), 100));

// Promise가 1급이라는 성질을 이용하여 위의 두 코드가 동일한 값이 되도록 해보자.
// go2 함수는 a가 비동기값일때에도 대응하는 함수이다.
const go2 = (a, f) => a instanceof Promise ? a.then(f) : f(a);

const r1 = go1(10, add5);
console.log(r1); // 15

const r2 = go2(delay100(10), add5);
r2.then(console.log); // 15

// r1과 r2의 표현을 완전 동일하게 변경할 수도 있다
// 값 n1(또는 n2)에 대한 add5 함수와 log 함수의 합성
const n1 = 10;
go1(go1(n1, add5), log);

const n2 = delay100(10);
go2(go2(n2, add5), log);



// - 함수 합성 관점에서의 Promise
// - promise는 비동기상황에서 함수 합성을 안전하게 하기 위한 도구
// - 비동기 값을 가지고 연속적인 함수실행을 안전하게 하는 monad
// - keyword: monad, 대수구조의 타입 (-> 나중에 찾아보고 공부해볼 것)
// 함수 합성
// f ﹒ g
// f(g(x))
// 이런 함수 합성을 안전하게 하도록 할 수 있게 하는 것이 monad이다.
// 그 중에서 비동기상황을 안전하게 합성할 수 있는 구현체가 Promise라고 할 수 있다.

// javascript에서는 monad를 활용한, 사용자정의 객체를 만들어서 코딩하지는 않는다.
// 그래도 모나드를 알고 있으면 함수합성을 할때 응용력을 가질 수 있다.

const g = a => a + 1;
const f = a => a * a;

console.log(f(g(1))); // 4, 함수 합성이 올바르게 되었다.
console.log(f(g())); // NaN, 유효한 값이 들어오지 않아서 함수합성이 올바르게 되지 않았다.
// -> 즉 이 함수는 유효한 값이 들어왔을 때에만 의도대로 동작하는 함수합성이다.
// -> monad는 어떠한 값이 들어올지 모르는 상황(심지어 값이 없을 수도 있는 상황)에서도 안전하게 함수합성을 할 수 있게 한다.

// monad는 값을 감싸고 있는 박스라고 생각하면 된다.
// 함수의 합성은 박스가 가지고 있는 메서드를 통해서 진행한다.
[1].map(g).map(f); // [4], 배열은 값이 없는 상황에서 안전하게 합성할 수 있게하는 monad라고 할 수 있다.
[].map(g).map(f);  // []

// 여기에서 array라는 값(자료구조?)는 필요한 값이 아니다. array 내부값을 다룰 수 있는 특정한 효과를 제공해주는 도구이다.
// 프로그램에서 최종적으로 사용되는 값(데이터?)이 아니고, 그 값을 다루는 데 필요한 기능을 제공해준다.(내생각)
// 최종적으로 사용되는 값: monad가 감싸고 있는 값!
[1].map(g).map(f).forEach(a => console.log(a));
//           ^합성      ^값을 가지고 외부 세상에 효과를 일으킴(console.log, html rendering...)
// 질문: 여기서 forEach는 array라는 모나드를 깨뜨리는 것이니까 L.take, L.reduce와 같이 분류된다고 생각하면 될까?

// 값이 없는 경우에도 안전하게 합성된다
// array는 값이 없든지, 하나이든지, 하나 이상이든지 상관없이 안전하게 합성할 수 있는 성질을 가지고 있다
[].map(g).map(f).forEach(a => console.log(a)); // 아무 일도 일어나지 않음(결과값이 NaN이던 앞선 예시와 비교해볼것)
[1, 2, 3].map(g).map(f).forEach(a => console.log(a)); // 값이 하나 이상인 경우
[1, 2, 3].map(g).filter(a => a % 2).map(f).forEach(a => console.log(a)); // filter 추가

// Promise의 경우
// Array와 Promise 비교: 완전히 동일한 형태인 것을 알 수 있다.
Array.of(1).map(g).map(f).forEach(r => console.log(r));
Promise.resolve(1).then(g).then(f).then(r => console.log(r));

// Kleisli Composition 관점에서의 Promise
// - Promise는 Kleisli Composition을 지원하는 도구
// - Kleisli Composition(또는 Kleisli Arrow)는 오류가 있을 수 있는 상황에서 함수 합성을 안전하게 할 수 있는 규칙
// - 함수에 잘못된 인자가 입력되거나 유효한 인자가 입력되었어도 어떤 함수가 의존하고 있는 외부의 상태에 의해서 결과를 정확히 전달할 수 없는 상황일 때 에러가 나는 것을 해결하는 것

// f ﹒ g
// f(g(x)) = f(g(x))
// x가 전달되었을 때의 함수합성의 결과가 어느 상황에서도 동일하다면 위의 식이 성립한다.
// memo: 참조투명성(=순수함수갸 표현식으로 안전하게 대체될 수 있음)의 개념을 지칭하는 것인지 찾아보기

// 하지만 실제 프로그래밍에서는 우항의 함수 g가 바라보고 있는 상태(x1)가 좌항의 함수 g가 바라보고 있는 상태(x2)로 달라질 수 있다. x1 !== x2
// -> 사실상 순수한 함수형 프로그래밍을 할 수 없다!(안돼에에)

// <Kleisli Composition>: 이런 상황에서도 특정한 규칙을 만들어 합성을 안전하게 만들고 이것을 조금더 수학적으로 바라볼 수 있도록 만드는 함수합성

// = f(g(x)) = g(x): g함수에서 에러가 난 경우의 결과가 f ﹒ g 합성을 했을 경우와 같은 결과를 갖게하도록 하는 것
// = f ﹒ g 함수합성을 하는 과정에서 g 함수에서 에러가 나서 리턴하는 값에 f 함수를 합성하더라도 같은 값을 리턴하도록 하는 것(마치 f를 합성을 하지 않은 것처럼)
// = (내 표현) 함수 합성을 하는 과정에서 에러가 났을때 더이상 다음 함수의 합성으로 에러값이 전파되지 않도록 막는 것?

const users = [
    {id:1, name:'aa'},
    {id:2, name:'bb'},
    {id:3, name:'cc'},
];

// 참고
const find = curry((f, iter) => go(
  iter,
  L.filter(f),
  take(1),
  ([a]) => a));

// 함수 합성이 올바로 작동하는 예시
const getUserById = id => find(u => u.id === id, users);
const f = ({name}) => name;
const g = getUserById;
const fg = id => f(g(id));

const r = fg(2);
log(r); // bb

// 함수 합성이 올바로 작동하지 않는 예시: 실제 프로그래밍에서는 users의 상태가 변화했기 때문
users.pop();
users.pop();
console.log(users); // [{id: 1, name: 'aa'}];

/*
const r3 = fg(2); // Uncaught TypeError: Cannot destructure property 'name' of 'undefined' as it is undefined.
console.log(r3); // 앞의 에러때문에 프로그램이 죽어버려서 이 줄은 실행되지 않는다.(안돼에에)
*/

// kleisli composition 활용
const getUserById2 = id => find(u => u.id === id, users) || Promise.reject('없어요');
const f = ({name}) => name;
const g = getUserById2();
const fg2 = id => Promise.resolve(id)
      .then(g) // 여기서 Promise.reject로 빠지기 때문에
      .then(f) // 이 코드는 실행되지 않는다
      .catch(a => a);

// 또다시 상태변경
users.pop();
users.pop();
console.log(users); // [{id: 1, name: 'aa'}];

fg2(2).then(log); // '없어요'

// 상태가 변화하여 존재하지 않는 user의 'name' property 값을 참조하는 함수합성을 하지 않는다.

// - go, pipe, reduce에서 비동기 제어
// - go, pipe, reduce는 함수 합성에 대한 함수.
// - Promise의 '비동기상황을 값으로 다루는 성질'을 이용하여 go나 pipe 함수도 비동기상황에 대응할 수 있도록 변경할 수 있다.
// - Kleisli composition처럼 함수들을 합성하다가 에러가 나거나 reject가 일어났을 때 합성을 중단하고 맨 뒤로 보낼 수도 있다.

go(1,
   a => a + 10,
   a => a + 100,
   a => a + 1000); // 1111

go(1,
   a => a + 10,
   a => Promise.resolve(a + 100),
   a => a + 1000); // [object Promise]1000, 비정상동작!


// 함수 합성 도중 Promise를 반환하더라도 제대로 합성되는 go를 만들어보자.
// 앞의 go2 함수를 만들때 사용한 기법을 활용하면 된다.

// 기존의 go 함수와 pipe함수
// 앞서 작성했던 go 함수는 reduce의 결과값을 반환하는 것 이외에 다른 일을 하고 있지 않다.
// pipe 함수도 go 함수를 사용하기 때문에 마찬가지다.
// 따라서 reduce 함수를 수정해야 한다.
const go = (...args) => reduce((a, f) => f(a), args);
const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);

// 기존의 reduce 함수
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


// Kleisli composition이 적용된 reduce 1
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
    acc = acc instanceof Promise ? acc.then(acc => f(acc, a)) : f(acc, a); // here
  }
  return acc;
});
// -> 하지만 acc가 Promise로 분류된 이후의 모든 함수 합성에서 acc가 Promise가 되어버리는 문제점 발생
// -> acc.then(acc => f(acc, a)) 의 반환값은 Promise이기 때문이다



// Kleisli composition이 적용된 reduce 2
// recur 유명함수를 만들어서 재귀
// acc를 만든 후에 acc가 Promise라면 재귀, 아니라면 다음 루프로 이동한다
const reduce = curry((f, acc, iter) => {
   if (!iter) {
     iter = acc[Symbol.iterator]();
     acc = iter.next().value;
   } else {
     iter = iter[Symbol.iterator]();
   }
   return function recur(acc) {
     let cur;
     while (!(cur = iter.next()).done) {
       const a = cur.value;
       acc = f(acc, a);
       if (acc instanceof Promise) return acc.then(recur);
     }
     return acc;
   }(acc);
});

// Kleisli composition이 적용된 reduce 3
// 첫번째로 들어가는 acc가 Promise인 경우에도 대응하면 좋다.
go(Promise.resolve(1), // <----- 이것
   a => a + 10,
   a => a + 100,
   a => a + 1000); // [object Promise]101001000


const reduce = curry((f, acc, iter) => {
   if (!iter) {
     iter = acc[Symbol.iterator]();
     acc = iter.next().value; // <--- 이 acc 값이 Promise인 경우이다.
   } else {
     iter = iter[Symbol.iterator]();
   }
   return function recur(acc) {
     let cur;
     while (!(cur = iter.next()).done) {
       const a = cur.value;
       acc = f(acc, f);
       if (acc instanceof Promise) return acc.then(recur);
     }
     return acc;
   }(acc);
});

// 앞서 정의한 go1 함수를 활용하면 된다.
const go1 = (a, f) => a instanceof Promise ? a.then(f) : f(a);

const reduce = curry((f, acc, iter) => {
   if (!iter) {
     iter = acc[Symbol.iterator]();
     acc = iter.next().value;
   } else {
     iter = iter[Symbol.iterator]();
   }
   return go1(acc, function recur(acc) {
     let cur;
     while (!(cur = iter.next()).done) {
       const a = cur.value;
       acc = f(acc, a);
       if (acc instanceof Promise) return acc.then(recur);
     }
     return acc;
   });
});


// Kleisli composition이 적용되어있다는 것을 확인할 수 있다.
// reject가 일어난 경우
go(1,
   a => a + 10,
   a => Promise.reject('oh~nooo~~!error!!'),
   a => console.log('------'), // '------' 값은 찍히지 않는다
   a => a + 1000)
 .catch(a => console.log(a));  // 'oh~nooo~~!error!!'


// - Promise.then의 중요한 규칙
// 중첩된 Promise 구문이라도 단 한번의 then으로 값을 꺼낼 수 있다.
Promise.resolve(Promise.resolve(1)).then(log); // 1
new Promise(resolve => resolve(new Promise(resolve1 => resolve1(1)))).then(log); // 1

