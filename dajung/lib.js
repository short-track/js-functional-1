const curry = f => 
    (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._) 

const map = curry((fn, arg) => {
    const result = []

    for (const element of arg) {
        result.push(fn(element))
    }
    return result
})

const filter = curry((fn, arg) => {
    const result = []

    for (const element of arg) {
        if (fn(element)) result.push(element)
    }

    return result
})

const reduce = curry((fn, acc, iter) => {
    if (!iter) {
        iter = acc[Symbol.iterator]()
        acc = iter.next().value
    }
    for (const element of iter) {
        acc = fn(acc, element)
    }
    return acc
})

const go = (...args) => {
    // reduce를 작성할 때 초기 값이 없는 경우도 처리했기 때문에
    // 그냥 사용이 가능하다
    return reduce((a, fn) => fn(a), args)
}

const pipe = (f, ...args) => {
    return function(...acc) {
        return go(f(...acc), ...args)
    }
}



// const sum = curry((f, iter) => go(
//     iter,
//     curry(map(f)),
//     curry(reduce(add))))

// export {
//     map,
//     filter,
//     reduce,
//     go,
//     pipe,
//     curry,
// }
