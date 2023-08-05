// 지연평가 + Promise - L.map, map, take
go([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
    L.map(a => a + 10),
    take(2),
    console.log); // "[object Promise]10", "[object Promise]10"

// L.map, map이 Promise를 입력받을 수 있도록 변경해보자.


// 기존의 L.map
L.map = curry(function* (f, iter) {
    for (const a of iter) {
        yield f(a);
    }
});

// after: 기존의 go1 함수만 적용해줘도 내부의 값에 함수를 적용한 Promise를 반환한다.
L.map = curry(function* (f, iter) {
    for (const a of iter) {
        yield go1(f(a));
    }
});

go([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
    L.map(a => a + 10),
    take(2),
    console.log); // [Promise, Promise]
                  // Promise {<resolved>: 11}
                  // Promise {<resolved>: 12}

// take 함수에서 Promise 내부의 값을 꺼내주도록 하면 동기적인 값을 합성하는 것처럼 동작할 것이다.

// 기존의 take 함수
const take = curry((l, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  let cur;
  while(!(cur=iter.next()).done) {
      const a = cur.value;
      console.log(a); // Promise {<pending>}
      res.push(a); // <--- a가 Promise인 경우에 대응해야 한다.
      if (res.length === l) return res;
  }
  return res;
});

// after 1:
// a 값이 Promise 이고 limit 루프에 도달하지 못한 경우,
// while문 안에서 Promise를 '리턴'하기 때문에 다시 루프를 돌기 쉽지 않다.
const take = curry((l, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();

  let cur;
  while(!(cur=iter.next()).done) {
    const a = cur.value;
    if (a instanceof Promise) return a.then(a => {
       res.push(a);
       if (res.length === l) return res;
    });
    res.push(a);
    if (res.length === l) return res;
  }
  return res;
});

// after 2
// 반복할 부분을 유명함수 표현식으로 감싼 다음에 재귀로 반복하면 된다.
const take = curry((l, iter) => {
    let res = [];
    iter = iter[Symbol.iterator]();
    return function recur() {
        let cur;
        while (!(cur=iter.next()).done) {
            const a = cur.value;
            if (a instanceof Promise) return a.then(a => {
               res.push(a);
               if (res.length === l) return res;
               return recur();
               // 삼항식으로 표현 (res.push(a), res).length === l ? res : recur();
            })
            res.push(a);
            if (res.length === l) return res;
        }
        return res;
    }();
});



 /* 이제 이런 코드들이 작성 가능해졌다.
   go(
      [1, 2, 3],
      L.map(a => Promise.resolve(a + 10)),
      take(2),
      log);

    go(
      [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
      L.map(a => a + 10),
      take(2),
      log);

    go(
      [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
      L.map(a => Promise.resolve(a + 10)),
      take(2),
      log);

    go(
      [1, 2, 3],
      map(a => Promise.resolve(a + 10)),
      log);

    go(
      [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
      map(a => a + 10),
      log);

    go(
      [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
      map(a => Promise.resolve(a + 10)),
      log);*/


// Kleisli Composition - L.filter, filter, nop, take
// - filter에서 지연평과와 비동기동시성(Promise)을 함께 구현하려면 kleisli compositoin을 활용하여야 한다.

/*
go([1,2,3,4,5],
   map(a => Promise.resolve(a * a),
   L.filter(a => a % 2),
   take(2),
   console.log); // [] 정상동작 x
 */

// filter로 들어오는 값이 Promise거나 filter가 내뱉는 값이 Promise 일때 어떻게 하면 지연평가 + 비동기 동시성을 지원하는 함수 합성을 할 수 있을까?

/*
L.filter = curry(function* (f, iter) {
   for (const a of iter) {
       const b = go1(a, f);
       if (b instanceof Promise) yield b.then(b => b ? a : Promise.reject('nop')
       // b가 false로 평가되면 함수 대기열을 실행하지 않아야 한다. kleisli composition
       // 실제 비동기동작중에 발생한 reject와 구분하기 위해 'nop' 구분자 설정
       //
       if (f(a)) yield a;
   }
});
*/


// filter에서 reject이 발생했다면 이후의 함수들은 실행되지도 않는다
// take 함수에서 reject를 catch
const take = curry((l, iter) => {
    let res = [];
    iter = iter[Symbol.iterator]();
    return function recur() {
        let cur;
        while (!(cur=iter.next()).done) {
            const a = cur.value;
            if (a instanceof Promise) return a.then(a => {
               res.push(a);
               if (res.length === l) return res;
               return recur();
             // reject가 실제 에러라면 다시한번 throw
            }).catch(e => e === 'nop' ? recur() : Project.reject(e))
            res.push(a);
            if (res.length === l) return res;
        }
        return res;
    }();
});

// reduce 에서 nop 지원
// reduce에서도 nop을 지원해서 지연성과 Promise를 잘 지원하도록 변경해보자.
// 아래의 함수합성에 기존의 reduce는 대응하지 못한다.
// iterator의 첫번째 값(여기서는 1)은 Promise라도 잘 꺼내어서 쓴다.
// 하지만 iter.next() 로 가져오는 그 이후의 값(여기서는 2 이후의 값)은 그러지 못한다.
go([1, 2, 3, 4],
   L.map(a => Promise.resolve(a * a)),
   L.filter(a => Promise.resolve(a % 2)),
   reduce(add),
   console.log);

// 기존의 reduce
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
      const a = cur.value;  // <-- 이 부분에서 a를 풀어주고
      acc = f(acc, a);      // <-- nop을 개치하면 된다
      if (acc instanceof Promise) return acc.then(recur);
    }
    return acc;
  })
});

// 처리할 부분을 함수로 따로 분리
const reduceF = (acc, a, f) =>
  a instanceof Promise ? a.then(a => f(acc, a)) :
  f(acc, a);


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
      acc = reduceF(acc, cur.value, f);
      if (acc instanceof Promise) return acc.then(recur);
    }
    return acc;
  })
});


// nop을 개치하는 부분도 추가
const reduceF2 = (acc, a, f) =>
  a instanceof Promise ?
  a.then(a => f(acc, a), e => e === nop ? acc : Promise.reject(e)) :
  f(acc, a);

// 조금더 추상화
const head = iter => go1(take(1, iter), ([h]) => h);
const reduce = curry((f, acc, iter) => {
  if (!iter) {
    return reduce(f, head(iter => acc[Symbol.iterator]()), iter);
  }
  iter = iter[Symbol.iterator]();

  return go1(acc, function recur(acc) {
    let cur;
    while (!(cur = iter.next()).done) {
      acc = reduceF(acc, cur.value, f);
      if (acc instanceof Promise) return acc.then(recur);
    }
    return acc;
  })
});

// 지연평가 + Promise의 효율성
// 값비싼 연산이 중간에 포함되었다고 가정
// 지연평가가 적용되었기 때문에 log가 3번밖에 찍히지 않는다.
go([1, 2, 3, 4, 5, 6, 7, 8],
  L.map(a => {
    log(a);
    return new Promise(resolve => setTimeout(() => resolve(a * a), 1000))
  }),
  L.filter(a => {
    log(a);
    return new Promise(resolve => setTimeout(() => resolve(a % 2), 1000))
  }),
  take(2),
  reduce(add),
  log);

// 지연된 함수열을 병렬적으로 평가하기 - C.reduce, C.take
// - 이터레이터의 각 값들을 동시에 출발시키는 코드
// - 더 큰 부하를 줄 수 있지만 빠른 응답이 필요할 때 사용하면 된다

// - catch 로그를 찍히지 않게 하기 위한 catchNoop 함수
  const C = {};
  const catchNoop = ([...arr]) =>
    (arr.forEach(a => a instanceof Promise ? a.catch(noop) : a), arr);

  C.reduce = curry((f, acc, iter) => iter ?
    reduce(f, acc, catchNoop(iter)) :
    reduce(f, catchNoop(acc)));

  C.take = curry((l, iter) => take(l, catchNoop(iter)));

  C.takeAll = C.take(Infinity);

  C.map = curry(pipe(L.map, C.takeAll));

  C.filter = curry(pipe(L.filter, C.takeAll));

// 이제 비동기적으로 동작하는 함수를 합성하면서도
// 지연적으로 동작하거나 동시적으로 동작하도록 컨트롤할 수 있다.
  const delay500 = (a, name) => new Promise(resolve => {
    console.log(`${name}: ${a}`);
    setTimeout(() => resolve(a), 100);
  });

  console.time('');
  go([1, 2, 3, 4, 5, 6, 7, 8],
    L.map(a => delay500(a * a, 'map 1')),
    L.filter(a => delay500(a % 2, 'filter 2')),
    L.map(a => delay500(a + 1, 'map 3')),
    C.take(2),
    reduce(add),
    log,
    _ => console.timeEnd(''));

//  async / await
// - async / await를 사용하더라도 Promise에 대한 이해는 여전히 필요하다
// - async  함수만 보면 Promise 없이 비동기를 처리하는 것 같지만
// - 결국에는 어딘가에서는 Promise를 리턴하는 함수가 필요하기 때문이다.
// - async 함수는 항상 Promise를 리턴한다. 함수 내에 리턴문이 있더라도 마찬가지이다.
  function delay(time) {
    return new Promise(resolve => setTimeout(() => resolve(), time));
  }

  async function delayIdentity(a) {
    await delay(500);
    return a;
  }

  async function f1() {
    const a = await delayIdentity(10);
    const b = await delayIdentity(5);
    return a + b;
  }

  // const pa = Promise.resolve(10);
  const pa = f1();

  (async () => {
    // log(await pa);
    // log(await pa);
    // log(await pa);
  })();
  // f1();
  // f1().then(log);
  // go(f1(), log);
  // (async () => {
  //   log(await f1());
  // }) ();


