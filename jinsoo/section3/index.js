const log = console.log;

const products = [
  { name: "반팔티", price: 15000 },
  { name: "긴팔티", price: 20000 },
  { name: "핸드폰케이스", price: 15000 },
  { name: "후드티", price: 30000 },
  { name: "바지", price: 25000 },
];

const map = (f, iter) => {
  let res = [];
  for (const a of iter) {
    res.push(f(a));
  }
  return res;
};

const filter = (f, iter) => {
  let res = [];
  for (const a of iter) {
    if (f(a)) res.push(a);
  }
  return res;
};

const reduce = (f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
};

//* map
(() => {
  let names = [];
  for (const p of products) {
    names.push(p.name);
  }
  log(names);

  const map = (f, iter) => {
    let res = [];
    for (const a of iter) {
      res.push(f(a));
    }
    return res;
  };

  log(map((p) => p.name, products));

  console.clear();
})();

//* map의 다형성
(() => {
  function* gen() {
    yield 2;
    if (false) yield 3;
    yield 4;
  }

  log(map((a) => a * a, gen()));

  let m = new Map();
  m.set("a", 10);
  m.set("b", 20);
  const it = m[Symbol.iterator]();
  log(it.next());
  log(it.next());
  log(it.next());
  log(new Map(map(([k, a]) => [k, a * 2], m)));

  console.clear();
})();

//* filter
(() => {
  const filter = (f, iter) => {
    let res = [];
    for (const a of iter) {
      if (f(a)) res.push(a);
    }
    return res;
  };

  log(...filter((p) => p.price < 20000, products));
  log(...filter((p) => p.price >= 20000, products));
  log(filter((n) => n % 2, [1, 2, 3, 4]));
  log(
    filter(
      (n) => n % 2,
      (function* () {
        yield 1;
        yield 2;
        yield 3;
        yield 4;
        yield 5;
      })()
    )
  );

  console.clear();
})();

//* reduce
(() => {
  const reduce = (f, acc, iter) => {
    if (!iter) {
      iter = acc[Symbol.iterator]();
      acc = iter.next().value;
    }
    for (const a of iter) {
      acc = f(acc, a);
    }
    return acc;
  };

  const add = (a, b) => a + b;
  log(reduce(add, 0, [1, 2, 3, 4, 5]));

  log(
    reduce((total_price, product) => total_price + product.price, 0, products)
  );

  console.clear();
})();

(() => {
  const add = (a, b) => a + b;

  log(
    reduce(
      add,
      map(
        (p) => p.price,
        filter((p) => p.price < 20000, products)
      )
    )
  );

  log(
    reduce(
      add,
      filter(
        (n) => n >= 20000,
        map((p) => p.price, products)
      )
    )
  );
})();
