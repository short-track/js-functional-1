const curry = f => 
    (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._)       

const map = curry((fn, iter) => {
    const result = []
    let current;
    iter = iter[Symbol.iterator]()

    while (!(current = iter.next()).done) {
        const element = current.value;

        result.push(fn(element))
    }
    return result
})

const filter = curry((fn, iter) => {
    const result = []
    let current;
    iter = iter[Symbol.iterator]()

    while (!(current = iter.next()).done) {
        const element = current.value;

        if (fn(element)) result.push(element)
    }

    return result
})

const reduce = curry((fn, acc, iter) => {
    if (!iter) {
        iter = acc[Symbol.iterator]()
        acc = iter.next().value
    } else {
        iter = iter[Symbol.iterator]()
    }

    let current;
    
    while (!(current = iter.next()).done) {
        const element = current.value;

        acc = fn(acc, element)
    }
    return acc
})

const go = (...args) => {
    // reduce를 작성할 때 초기 값이 없는 경우도 처리했기 때문에
    // 그냥 사용이 가능하다
    return reduce((a, fn) => fn(a), args)
}

// const pipe = (f, ...args) => {
//     return function(...acc) {
//         return go(f(...acc), ...args)
//     }
// }

const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);

// const sum = curry((f, iter) => go(
//     iter,
//     curry(map(f)),
//     curry(reduce(add))))

const range = (l) => {
    // let i = -1;
    // let res = [];

    // while (++i < l) {
    //     res.push(i)
    // }
    // return res
    const result = []

    for (let i = 0; i < l; i += 1) {
        result.push(i)
    }
    return result
}

const take = curry((l, iter) => {
    const result = []
    iter = iter[Symbol.iterator]()
    let current;
    while (!(current = iter.next()).done) {
        const element = current.value;
        result.push(element)
        if (result.length === l) return result
    }
    return result
})

const L = {}

L.range = function *(l) {
    let i = -1;

    while (++i < l) {
        yield i;
    }
}

L.map = curry(function *(f, iter) {
    for (const element of iter) yield f(element)
})

L.filter = curry(function *(f, iter) {
    for (const element of iter) {
        if (f(element)) yield element
    }
})


const isIterable = a => a && a[Symbol.iterator]

L.flatten = function *(iter) {
    for (const element of iter) {
        if (isIterable(element)) for (const b of element) yield b;
        else yield element;
    }
}

L.flatMap = curry(pipe(L.map, L.flatten))

const flatten = pipe(L.flatten, take(Infinity))
const flatMap = curry(pipe(L.map, flatten))
const takeAll = take(Infinity)
module.exports = {
    map,
    filter,
    reduce,
    go,
    pipe,
    curry,
    range,
    take,
    takeAll,
    flatten,
    flatMap,
    L
}
