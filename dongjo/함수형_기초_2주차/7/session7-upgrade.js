import { log, reduce, curry } from './../common.js'

// map과 filter 를 더 간결한 코드로 만든다.

const takeAll = take(Infinity);

// 기본 map
const map = (f, iter) => {
    let res = [];
    for (const a of iter) {
        res.push(f(a));
    }
    return res;
};

// curry를 적용한 map
const Cmap = curry((f, iter) => {
    let res = [];
    for (const a of iter) {
      res.push(f(a));
    }
    return res;
});

// curry와 lazy를 적용한 map
L.map = curry(function* (f, iter) {
    for (const a of iter) {
        yield f(a);
    }
});

// ## L.map + take로 filter 만들기
// 솔직히 이건 왜 하는지 모르겠다. L.map() 그대로 쓰면 되는거 아닌가?
const Lmap = curry(pipe(L.map, takeAll));



// ---------------

// 기본 filter
const filter = (f, iter) => {
    let res = [];
    for (const a of iter) {
        if (f(a)) res.push(a);
    }
    return res;
};

// curry를 적용한 filter
const Cfilter = curry((f, iter) => {
    let res = [];
    for (const a of iter) {
      if (f(a)) res.push(a);
    }
    return res;
});

// curry와 lazy를 적용한 map
L.filter = curry(function* (f, iter) {
    for (const a of iter) {
        if (f(a)) yield a;
    }
});

// ## L.filter + take로 filter 만들기
const Lfilter = curry(pipe(L.filter, takeAll));
