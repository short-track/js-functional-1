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

// reduce에서 nop 지원(WIP)
