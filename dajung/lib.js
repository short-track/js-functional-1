const curry = f => 
    (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._)       

const go1 = (a, f) => a instanceof Promise ? a.then(f) : f(a)

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

const reduceF = (acc, a, f) => 
    // nop 확인
    a instanceof Promise ? 
        a.then(a => f(acc, a), e => e == nop ? acc : Promise.reject(e)) :
       f(acc, a)

const head = iter => go1(take(1, iter), ([h]) => h)

const reduce = curry((f, acc, iter) => {
    if (!iter) {
        // 아래 코드도 비동기 처리를 해주면 좋다
        // iter = acc[Symbol.iterator]()
        // acc = iter.next().value
        return reduce(f, head(iter = acc[Symbol.iterator]()), iter)
    }

    iter = iter[Symbol.iterator]()

    return go1(acc, function recur(acc) {
        let current;
    
        while (!(current = iter.next()).done) {
            // 아래 두 줄을 하나의 메서드로 분리
            // const element = current.value;
            // acc = fn(acc, element)
            acc = reduceF(acc, current.value, f)
            // 만약에 acc가 promise면 
            if (acc instanceof Promise ) return acc.then(recur);

        }
        return acc;
    });
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
    return function recur() {
        let current;
        while (!(current = iter.next()).done) {
            const element = current.value;
            // promise 일 수 있는 상황
            if (element instanceof Promise) {
                return element
                .then(a => (result.push(a), result).length === l ? result : recur())
                .catch(e => e == nop ? recur() : Promise.reject(e))
            }
            result.push(element)
            if (result.length === l) return result
        }
        return result
    }()
})

const L = {}

L.range = function *(l) {
    let i = -1;

    while (++i < l) {
        yield i;
    }
}

L.map = curry(function *(f, iter) {
    for (const element of iter) yield go1(element, f)
})

const nop = Symbol('nop')

L.filter = curry(function *(f, iter) {
    for (const element of iter) {
        const b = go1(element, f)
        if (b instanceof Promise) yield b.then(b => b ? element : Promise.reject(nop))
        else if (b) yield element
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

const find = curry((f, iter) => go(
    iter,
    L.filter(f),
    take(1),
    ([a]) => a));


const map = curry(pipe(L.map, takeAll))

const C = {}

const noop = function() {}

const catchNoop = arr =>
    (arr.forEach(a => a instanceof Promise ? a.catch(noop) : a), arr)
C.reduce = curry((f, acc, iter) => iter ? 
    reduce(f, acc, [...iter]) :
    reduce(f, [...acc]))

C.reduce = curry((f, acc, iter) => {
    const iter2 = catchNoop(iter ? [...iter] : [...acc])
    return iter ? 
        reduce(f, acc, iter2) :
        reduce(f, iter2)
})

C.take = curry((l, iter) => take(l, catchNoop([...iter])))

C.takeAll = C.take(Infinity)

C.map = curry(pipe(L.map, C.takeAll))
C.filter = curry(pipe(L.filter, C.takeAll))



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
    find,
    L,
    C
}
