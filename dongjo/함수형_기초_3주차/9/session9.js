// ## 지연 평가 + Promise - L.map, map, take

/*  go(
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

// ## Kleisli Composition - L.filter, filter, nop, take

go([1, 2, 3, 4, 5, 6],
    L.map(a => Promise.resolve(a * a)),
    // L.map(a => a * a),
    filter(a => Promise.resolve(a % 2)),
    // L.map(a => a * a),
    /*L.map(a => {
        log(a);
        return a * a;
    }),
    L.map(a => {
        log(a);
        return a * a;
    }),*/
    // take(4),
    /*log*/);

// ## reduce에서 nop 지원

go([1, 2, 3, 4, 5],
    L.map(a => Promise.resolve(a * a)),
    L.filter(a => Promise.resolve(a % 2)),
    reduce(add)/*,
    log*/);

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


// ## 지연된 함수열을 병렬적으로 평가하기 - C.reduce, C.take

const C = {};

function noop() {
}

const catchNoop = ([...arr]) =>
(arr.forEach(a => a instanceof Promise ? a.catch(noop) : a), arr);

C.reduce = curry((f, acc, iter) => iter ?
reduce(f, acc, catchNoop(iter)) :
reduce(f, catchNoop(acc)));

C.take = curry((l, iter) => take(l, catchNoop(iter)));

C.takeAll = C.take(Infinity);

C.map = curry(pipe(L.map, C.takeAll));

C.filter = curry(pipe(L.filter, C.takeAll));

const delay1000 = a => new Promise(resolve => {
        console.log('hi~');
        setTimeout(() => resolve(a), 1000);
});
/*  // console.time('');
go([1, 2, 3, 4, 5, 6, 7, 8, 9],
    L.map(a => delay1000(a * a)),
    L.filter(a => delay1000(a % 2)),
    L.map(a => delay1000(a * a)),
    // C.take(2),
    C.reduce(add),
    /!*log,
    _ => console.timeEnd('')*!/);*/

// ## 즉시 병렬적으로 평가하기 - C.map, C.filter

  // C.map(a => delay1000(a * a), [1, 2, 3, 4]).then(log);
  // C.filter(a => delay1000(a % 2), [1, 2, 3, 4]).then(log);

// ## 즉시, 지연, Promise, 병렬적 조합하기

// const delay500 = a => a;
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


