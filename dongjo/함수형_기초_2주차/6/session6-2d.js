
// # 이터러블 중심 프로그래밍에서의 지연 평가 (Lazy Evaluation)
// - 제때 계산법
// - 느긋한 계산법
// - 제너레이터/이터레이터 프로토콜을 기반으로 구현

// ### L.map


   L.map = function *(f, iter) {
     for (const a of iter) yield f(a);
   };
   var it = L.map(a => a + 10, [1, 2, 3]);
   log(it.next());
   log(it.next());
   log(it.next());


// ### L.filter


   L.filter = function *(f, iter) {
     for (const a of iter) if (f(a)) yield a;
   };
   var it = L.filter(a => a % 2, [1, 2, 3, 4]);
   log(it.next());
   log(it.next());
   log(it.next());



// ### range, map, filter, take, reduce 중첩 사용


  const range = l => {
    let i = -1;
    let res = [];
    while (++i < l) {
      res.push(i);
    }
    return res;
  };

  const map = curry((f, iter) => {
    let res = [];
    iter = iter[Symbol.iterator]();
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      res.push(f(a));
    }
    return res;
  });

  const filter = curry((f, iter) => {
    let res = [];
    iter = iter[Symbol.iterator]();
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      if (f(a)) res.push(a);
    }
    return res;
  });

  const take = curry((l, iter) => {
    let res = [];
    iter = iter[Symbol.iterator]();
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      res.push(a);
      if (res.length == l) return res;
    }
    return res;
  });

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

   console.time('');
   go(range(100000),
     map(n => n + 10),
     filter(n => n % 2),
     take(10),
     log);
   console.timeEnd('');


// ### L.range, L.map, L.filter, take, reduce 중첩 사용


  L.range = function* (l) {
    let i = -1;
    while (++i < l) {
      yield i;
    }
  };

  L.map = curry(function* (f, iter) {
    iter = iter[Symbol.iterator]();
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      yield f(a);
    }
  });

  L.filter = curry(function* (f, iter) {
    iter = iter[Symbol.iterator]();
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      if (f(a)) {
        yield a;
      }
    }
  });

//    [0, 1, 2, 3, 4, 5, 6, 7, 8...]
//    [10, 11, 12, ...]
//    [11, 13, 15 ..]
//    [11, 13]
  
//    [0    [1
//    10     11
//    false]  true]
  

   console.time('L');
   go(L.range(Infinity),
     L.map(n => n + 10),
     L.filter(n => n % 2),
     take(10),
     log);
   console.timeEnd('L');


// ### map, filter 계열 함수들이 가지는 결합 법칙

// - 사용하는 데이터가 무엇이든지
// - 사용하는 보조 함수가 순수 함수라면 무엇이든지
// - 아래와 같이 결합한다면 둘 다 결과가 같다.

// [[mapping, mapping], [filtering, filtering], [mapping, mapping]]
// =
// [[mapping, filtering, mapping], [mapping, filtering, mapping]]
