import { go, log, curry, take } from './../common.js';
/*
    지연 평가의 ... spread 연산자을 사용하여, 제너레이터 함수를 펼칠수 있다.
    이는 제너레이터 함수의 next() 메서드를 호출하면서, yield 키워드를 통해 값을 반환하는 것과 같다.
    이는 한꺼번에 next()를 모두 소비시키는 것이다.
*/
function* gen() {
    yield 1;
    yield 2;
    yield 3;
    return 100;
}
console.log(...gen());

const L = {};
const C = {};
const go1 = (a, f) => a instanceof Promise ? a.then(f) : f(a);

L.map = curry(function* (f, iter) {
    log('L.map');
  for (const a of iter) {
    yield go1(a, f);
  }
});
C.take = curry((l, iter) => take(l, [...iter]));

const arr = [1, 2, 3];
const delay1000 = (a, name) => new Promise(resolve => {
    const flag = `${name}-${a}`;
    // log(`${name}: ${a}`);
    console.time(flag)
    setTimeout(() => {
        console.timeEnd(flag)
        return resolve(a)
    }, 1000);
});

log("-------")
console.time()
go(arr,
    L.map(a => delay1000(a * a, 'map 1')),
    L.map(a => delay1000(a * a, 'map 2')),
    take(Infinity),
    log,
    _ => console.timeEnd(),
)
log("-------")

