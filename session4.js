// go / pipe

/**
 * go 함수
 * 첫번째 인자의 값을 두번째 함수의 인자로 입력하여 값으로 평가 -> 다음 함수의 인자로 입력 -> 반복해서 최종적으로 하나의 값으로 평가된다
 */

const go = (...args) => reduce((a, f) => f(a), args);

go(
  0,
  a => a + 1,
  a => a + 10,
  a => a + 100,
  console.log
); // 111


/**
 * pipe 함수
 * 인자로 받은 함수들을 합성해서 하나의 함수를 리턴한다.
 * 리턴된 함수는 첫번째 함수의 인자의 수와 타입을 받으며 마지막 함수의 리턴값의 타입을 리턴한다.
 */

const pipe = (...fs) => (a) => go(a, ...fs);

const f = pipe(
  a => a + 1,
  a => a + 10,
  a => a + 100,
);
console.log(f(0)); // 111

// pipe 함수2: 첫번째 함수에 두개 이상의 인자를 넣을 수 있는 버전
const pipe2 = (f, ...fs) => (...as) => go(f(...as), ...fs);

const f2 = pipe(
  (a, b) => a + b,
  a => a + 10,
  a => a + 100,
)

// go와 pipe 함수로 함수를 합성할때 더 읽기 쉬운 방식으로 표현할 수 있다.
// 기존의 함수합성 방식에서,
console.log(
    reduce(add,
           map(p => p.price,
               filter(p => p.price < 20000, products))));

// go 함수를 사용하면 가독성을 늘릴 수 있다.

const products = [
  { name: '반팔티', price: 15000 },
  { name: '긴팔티', price: 20000 },
  { name: '핸드폰케이스', price: 15000},
  { name: '후드티', price: 30000 },
  { name: '바지', price: 25000 },
];

go(
  products,
  products => filter(p => p.price < 20000, products),
  products => map(p => p.price, products),
  prices => reduce(add, prices),
  console.log
);



/**
 * curry
 * 코드를 값으로 다루면서, 받아둔 함수를 원하는 시점에 실행시키는 것
 */

const curry = f => (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);

const products2 = [
  { name: '반팔티', price: 15000 },
  { name: '긴팔티', price: 20000 },
  { name: '핸드폰케이스', price: 15000},
  { name: '후드티', price: 30000 },
  { name: '바지', price: 25000 },
];

// 커링을 사용하면 위의 go 함수로 products를 다루는 로직을 더 간결하게 작성할 수 있다.

// map 함수를 curry로 래핑
const map = curry((f, iter) => {
  const res = [];
  for (const a of iter) {
    res.push(f(a));
  }
  return res;
});

// filter 함수를 curry로 래핑
const filter = curry((f, iter) => {
  const res = [];
  for (const a of iter) {
    res.push(f(a));
  }
 return res;
});

// reduce 함수를 curry로 래핑
const reduce = curry((f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
});

// 이 코드를,
go(
  products2,
  products => filter(p => p.price < 20000, products),
  products => map(p => p.price, products),
  prices => reduce(add, prices),
  console.log
)

// 이렇게 변경한 후,
go(
  products2,
  products => filter(p => p.price < 20000)(products),
  products => map(p => p.price)(products),
  prices => reduce(add)(prices),
  console.log
)

// 이렇게 변경할 수 있다.
go(
  products2,
  filter(p => p.price < 20000),
  map(p => p.price),
  reduce(add),
  console.log
)


/**
 * 함수 조합으로 함수 만들기
 * 커링을 이용해서 코드를 분리, 재조립 할 수 있다.
 */

go(
  products,
  filter(p => p.price < 20000),
  map(p => p.price),
  reduce(add),
  console.log
);


// 2. 일부분을 분리, 재조립 할 수 있다.
const total_price = pipe(
  map(p => p.price),
  reduce(add)
);

go(
  products,
  filter(p => p.price < 20000),
  total_price,
  console.log
);


// 3. filter의 콜백함수를 인자로 받아 더 분리할 수도 있다.
const best_total = predi => pipe(
  filter(predi),
  total_price,
);

go(
  products,
  best_total(p => p.price < 2000),
  console.log
);
















