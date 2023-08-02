// ## 결과를 만드는 함수 reduce, take

// ### reduce


L.entries = function* (obj) {
    for (const k in obj) yield [k, obj[k]];
  };

  const join = curry((sep = ',', iter) =>
    reduce((a, b) => `${a}${sep}${b}`, iter));

  const queryStr = pipe(
    L.entries,
    L.map(([k, v]) => `${k}=${v}`),
    join('&'));

  log(queryStr({limit: 10, offset: 10, type: 'notice'}));

   function *a() {
     yield 10;
     yield 11;
     yield 12;
     yield 13;
   }
  
   log(join(' - ', a()));


// // ### take, find


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