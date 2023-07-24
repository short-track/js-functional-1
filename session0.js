// 평가
// - 코드가 계산(Evaluation) 되어 값을 만드는 것

// 일급
// - 값으로 다룰 수 있다.
// - 변수에 담을 수 있다.
// - 함수의 인자로 사용될 수 있다.
// - 함수의 결과로 사용될 수 있다.

const a = 10;
const add10 = a => a + 10;
const r = add10(a);
// console.log(r); // 20

// 일급 함수
// - 함수를 값으로 다룰 수 있다.
// - 조합성과 추상화의 도구

const add5 = a => a + 5;
console.log(add5);
console.log(add5(5));

const f1 = () => () => 1;
console.log(f1()); //

const f2 = f1();
console.log(f2);
console.log(f2());

// 일급 함수
// - 함수가 값으로 다뤄질 수 있다.

// 고차 함수
// - 함수를 값으로 다루는 함수

// 함수를 인자로 받아서 실행하는 함수
// - apply1
// - times

const apply1 = f => f(1);
const add2 = a => a + 2;
console.log(apply1(add2));
console.log(apply1(a => a - 1));

const times = (f, n) => {
  let i = -1;
  while (++i < n) f(i);
};

times(console.log, 3);
times(a => console.log(a + 10), 3);

// 함수를 만들어 리턴하는 함수 (클로저를 만들어 리턴하는 함수)
// addMaker

const addMaker = a => b => a + b;
console.log(add10(5));
console.log(add10(10));

