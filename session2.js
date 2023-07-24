// generator / iterator
// - generator 는 iterator 이자 iterable 를 반환하는 함수다.
// - iterator 의 next 메서드를 호출할 때마다 yield 문으로 반환한 값을 반환한다.
// - iterable 프로토콜을 더 편하게 사용하기 위한 인터페이스이다.
// - generator 로 만든 iterator 도 well-formed iterator 이다.

function *gen() {
  yield 1;
  yield 2;
  yield 3;
}

const iterator = gen();
iterator.next(); // 1
iterator.next(); // 2
iterator.next(); // 3

// generator 사용예제
function *infinity(i = 0) {
  while(true) yield i++;
}

// 사용예제1
function *odds(limit) {
  for (let i = 0; i < limit; i++) {
    if (i % 2) yield i;
  }
}

// 사용예제2: *infinity generator 사용해서 odd 함수 구현
function *odd2(limit) {
  for (const a of infinity(1)) {
    if (a % 2) yield a;
    if (a === limit) return;
  }
}

function *limit(l, iter) {
  for (const a of iter) {
    yield a;
    if (a === l) return;
  }
}

// 사용예제3: *limit generator / *infinity generator 를 사용해서 odd 함수 구현
function *odd3(l) {
  for (const a of limit(l, infinity(1))) {
    if (a % 2) yield a;
  }
}

const iter = odd3(10); // odd1(10); odd2(10);
iter.next();
iter.next();
iter.next();
iter.next();
iter.next();

for (const a of odd3(40)) console.log(a);

// 전개연산자, 구조분해할당, 나머지 연산자
console.log(...odd3(3)); // 1 2 3
console.log([...odd3(3), ...odd3(5)]); // [1, 2, 3, 1, 2, 3, 4, 5]
const [head, ...tail] = odd3(5);
