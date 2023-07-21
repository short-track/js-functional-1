const log = console.log;

const products = [
  { name: "반팔티", price: 15000 },
  { name: "긴팔티", price: 20000 },
  { name: "핸드폰케이스", price: 15000 },
  { name: "후드티", price: 30000 },
  { name: "바지", price: 25000 },
];

const curry =
  (f) =>
  (a, ..._) =>
    _.length ? f(a, ..._) : (..._) => f(a, ..._);

const map = curry((f, iter) => {
  let res = [];
  for (const a of iter) {
    res.push(f(a));
  }
  return res;
});

const pipe =
  (f, ...fs) =>
  (...as) =>
    go(f(...as), ...fs);

const filter = curry((f, iter) => {
  let res = [];
  for (const a of iter) {
    if (f(a)) res.push(a);
  }
  return res;
});

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

const add = (a, b) => a + b;

const go = (...args) => reduce((a, f) => f(a), args);

//* go
//* pipe

(() => {
  const go = (...args) => reduce((a, f) => f(a), args);

  go(
    add(0, 1),
    (a) => a + 10,
    (a) => a + 100,
    log
  );
  // 111

  const pipe =
    (f, ...fs) =>
    (...as) =>
      go(f(...as), ...fs);

  const f = pipe(
    (a, b) => a + b,
    (a) => a + 10,
    (a) => a + 100
  );

  log(f(0, 1));

  log(
    reduce(
      add,
      map(
        (p) => p.price,
        filter((p) => p.price < 20000, products)
      )
    )
  );

  go(
    products,
    (products) => filter((p) => p.price < 20000, products),
    (products) => map((p) => p.price, products),
    (prices) => reduce(add, prices),
    log
  );
})();

//* curry
(() => {
  //* 함수를 return 한다.
  //* 나머지 인자 1개 이상이라면 함수를 즉시 실행하고 아니라면 다시 함수를 return 한다.
  const curry =
    (f) =>
    (a, ..._) =>
      _.length ? f(a, ..._) : (..._) => f(a, ..._);

  const mult = curry((a, b) => a * b);
  log(mult(3)(2));

  const mult3 = mult(3);
  log(mult3(10));
  log(mult3(5));
  log(mult3(3));
  console.clear();

  //* as-is
  go(
    products,
    (products) => filter((p) => p.price < 20000, products),
    (products) => map((p) => p.price, products),
    (prices) => reduce(add, prices),
    log
  );

  //! step 1
  //* map, filter, reduce에 curry를 적용해주면
  //* 마찬가지로 인자를 하나 받으면 다른 인자를 받을 수 있도록 함수를 return 한다
  go(
    products,
    (products) => filter((p) => p.price < 20000)(products),
    (products) => map((p) => p.price)(products),
    (prices) => reduce(add)(prices),
    log
  );

  //! step2
  //* go는 첫번째 인자를 다음 함수의 인자로 넘김
  //* 그래서 아래와 같이 사용 가능
  go(
    products,
    filter((p) => p.price < 20000),
    map((p) => p.price),
    reduce(add),
    log
  );

  console.clear();
})();

(() => {
  const total_price = pipe(
    map((p) => p.price),
    reduce(add)
  );

  const base_total_price = (predi) => pipe(filter(predi), total_price);

  go(
    products,
    base_total_price((p) => p.price < 20000),
    log
  );

  go(
    products,
    base_total_price((p) => p.price >= 20000),
    log
  );
})();
