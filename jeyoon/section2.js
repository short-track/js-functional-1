// ** 제너레이터/이터레이터
// 제너레이터: 이터레이터이자 이터러블을 생성하는 함수

function* gen() {
  // 제네레이터 함수
  yield 1;
  yield 2;
  yield 3; // yield를 통해 몇번의 next로 값을 꺼내줄 지 결정할 수 있음
  return 100;
}

let iter = gen(); // 이터레이터이자 이터러블
console.log(iter[Symbol.iterator]() === iter); // 제너레이터는 well-formed 이터레이터
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());

for (const a of gen()) {
  console.log(a); // 1 2 3 -> 순회할 때는 리턴값 없음
}

// js에서는 어떤 값이든 이터러블이면 순회 가능
// 그런데 제너레이터는 문장을 값으로 만들수 있고, 문장을 통해 순회할 수 있는 값을 만들 수 있음
// 즉, 제너레이터를 통해 어떤 값도  순회할 수 있는 형태로 조작할 수 있음

// ** odds
function* odds(l) {
  // 제너레이터 함수
  //   for (let i = 0; i < l; i++) {
  //     if (i % 2) yield i;
  //   }
  for (const a of limit(l, infinity(1))) {
    if (a % 2) yield a;
    if (a == l) return;
  }
}

let iter2 = odds(10);
console.log(iter2.next()); // 1
console.log(iter2.next()); // 3
console.log(iter2.next()); // 5
console.log(iter2.next()); // 7
console.log(iter2.next()); // 9
console.log(iter2.next());
console.log(iter2.next());

function* infinity(i = 0) {
  while (true) {
    // 무한 수열 생성
    yield i++;
  }
}

let iter3 = infinity();
console.log(iter3.next());
console.log(iter3.next());
console.log(iter3.next());
console.log(iter3.next());
console.log(iter3.next());
console.log(iter3.next());

function* limit(l, iter) {
  for (const a of iter) {
    yield a;
    if (a == l) return;
  }
}

let iter4 = limit(4, [1, 2, 3, 4, 5, 6]);
console.log(iter4.next());
console.log(iter4.next());
console.log(iter4.next());
console.log(iter4.next());
console.log(iter4.next());
console.log(iter4.next());
console.log(iter4.next());

for (const a of odds(40)) console.log(a);

console.clear();

// ** for of, 전개 연산자. 구조 분해, 나머지 연산자
console.log(...odds(10));
console.log([...odds(10), ...odds(20)]);

const [head, ...tail] = odds(5);
console.log(head); // 1
console.log(tail); // [3, 5];

const [a, b, ...rest] = odds(10);
console.log(a); // 1
console.log(b); // 3
console.log(rest); // [5,7,9]
