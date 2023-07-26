
/*
map
상품에 대한 정보가 담겨있는 배열에서 상품의 가격이나 상품의 이름만으로 이루어진 새로운 배열을 만든다고 해보자.
map 함수는 배열의 각요소를 다른 값으로 변경해주는 로직을 함수로 추상화해준 것이다. 즉, map은 고차함수이다.
*/

// 이 챕터에서 사용하는 데이터
const products = [
  { name: '반팔티', price: 15000 },
  { name: '긴팔티', price: 20000 },
  { name: '핸드폰케이스', price: 15000},
  { name: '후드티', price: 30000 },
  { name: '바지', price: 25000 },
];

// 상품의 가격만 담겨있는 배열 생성
const prices = [];
for (const a of products) {
   prices.push(a.price);
}
console.log(prices);

// 상품의 이름만 담겨있는 배열 생성
const names = [];
for (const a of products) {
   names.push(a.name);
}
console.log(names);

// map 함수로 이러한 일들을 추상화할 수 있다.
// map 함수는 이터러블 프로토콜을 따르고 있기 때문에 다형성이 굉장히 높다.
const map = (f, iter) => {
  const res = [];
  for (const a of iter) {
     res.push(f(a));  // 이터러블의 각 요소를 다른 값으로 변화시키는 로직을 함수에 위임
  }
  return res;
}

// querySelectorAll로 받아온 NodeList에는 map 메서드가 없다.
// NodeList는 Array를 상속받은 객체가 아니기 때문이다.
const nodes = document.querySelectorAll('*');
const nodeNames1 = nodes.map(s => s.nodeName); // uncaught error

// 그러나 NodeList는 이터러블 프로토콜을 따르기 때문에  map 함수로 값을 받아올 수 있다!
const nodeNames2 = map(s => s.nodeName, nodes); // ['...', '...', '...']

// map 함수는 이터러블 프로토콜을 따르기만 한다면 동작한다. (Set, Map, Array, Generator 등등..)
// 제네레이터의 yield 처럼 문장조차도 값으로 넣을 수 있으니 사실상 모든 것들을 map 할 수 있다.
function *gen() {
  yield 2;
  yield 3;
  yield 4;
}
console.log(map(a => a * a, gen())); // [4, 9, 16]


// javascript Map 자료구조도 이터러블 프로토콜을 따르고 있기 때문에 map 함수를 적용할 수 있다.
const m = new Map();
m.set('a', 10);
m.set('b', 20);
const d = map(([k, v]) => [k, v * 2], m);
console.log(d); // [['a', 20], ['b', 40]]

// map을 적용한 값을 다시 Map으로 변환할 수 있다.
console.log(new Map(d)); // Map(2) {'a' => 20, 'b' => 40}





/*
filter
상품에 대한 정보가 담겨있는 배열에서 상품의 가격이 특정 액수 이상의 상품만 포함된 배열 생성한다고 해보자.
filter 함수는 특정 조건을 충족하는 데이터만 걸러낼때 사용한다.
*/

// 20000원 미만의 상품만 담는 배열 생성
const under20000 = [];
for (const a of products) {
  if (a.price < 20000) under20000.push(a);
}
console.log(...under20000);

// filter 함수
const filter = (f, iter) => {
  const res = [];
  for (const a of iter) {
    if (f(a)) res.push(a); // 필터링 로직을 함수에 위임
  }
  return res;
}

const prices2 = filter(a => a.price < 20000, products);

// 마찬가지로, 이터러블 프로토콜을 따르는 값이라면 모두 filter 가능하다.
console.log(
  filter(a => a % 2, [1, 2, 3, 4, 5]), // [1, 3, 5]
  filter(a => a % 2, function *gen() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
  } ()) // [1, 3, 5]
);



/*
reduce
reduce 함수는 이터러블을 하나의 값으로 축약할 때 사용하는 함수이다.
*/

// reduce를 쓰지 않고 배열의 총합 구할때,
const nums = [1, 2, 3, 4, 5];
let total = 0;
for (const a of nums) {
  total = total + a
}
console.log(total);

const reduce = (f, acc, iter) => {
  for (const a of iter) {
    acc = f(acc, a); // (하나의 값으로 축약하는) 로직을 위임
  }
  return acc;
}

// 두번째 인자로 이터레이터를 넣어줬을 경우(= acc 매개변수에 해당하는 값을 넣어주지 않았을 경우에도 동작하는) reduce 구현
const reduce2 = (f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }

  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
}



/**
 * map, filter, reduce의 중첩사용과 함수형 사고
 * 가격이 20000원 이하인 상품들의 가격들의 합계를 구하는 예시.
 * 잡해보이겠지만 오른쪽부터 값으로 평가하며 읽어나가면 된다.
 * ap, filter 함수는 결국 이터러블인 Array를 반환하기 때문에 reduce의 세번째(혹은 두번째) 인자에 넣을 수 있다.
 */

const add = (a, b) => a + b;

console.log(
    reduce(add,
           map(p => p.price,
               filter(p => p.price < 20000, products))));

// 참고: filter와 map의 순서를 바꾼 예
console.log(
    reduce(add,
           filter(p => p < 20000,
                  map(p => p.price, products))));


// 이렇듯 함수형 프로그래밍에서는 함수를 중첩하고 함수를 연속적으로 실행함으로써, 특정 값에서 출발해서 원하는 값으로 평가할 수 있도록 하여 코딩한다.
// 1. 먼저 숫자를 요소로 갖는 이터러블로 평가될 값이 들어올 것이라고 예상하며 코딩한다
console.log(
  reduce(add,
         [10, 20, 30])); // 60

// 2. reduce의 이터레이터는 number를 값으로 가질 것을 예상하고, 해당 값을 표현식으로 변경할 수 있다(map 함수 사용)
console.log(
  reduce(add,
        map(p => p.price, products))); // 이 부분은 숫자를 값으로 갖는 이터레이터로 평가된다.

// 3. map 함수의 이터레이터는 price 프로퍼티를 갖는 것을 예상하고, 해당 값을 표현식으로 변경할 수 있다(filter 함수 사용)
console.log(
  reduce(add,
        map(p => p.price),
          filter(p => p.price < 20000), products)
)
