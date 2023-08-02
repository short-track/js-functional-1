// 지연 평가에 Promise 적용
const { L, go, take, curry, takeAll, map } = require('../lib')
go([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
    L.map(a => a + 10),
    take(2),
    console.log
) // [ '[object Promise]10', '[object Promise]10' ]

// 위의 상황을 계산된 값이 나오게 바꿔본다
const go1 = (a, fn) => a instanceof Promise ? a.then(fn) : fn(a)
Lmap = curry(function *(f, iter) {
    for (const element of iter) yield go1(element, f)
})

go([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
    Lmap(a => a + 10),
    take(2),
    console.log
) // [ Promise { <pending> }, Promise { <pending> } ]

const ptake = curry((l, iter) => {
    const result = []
    iter = iter[Symbol.iterator]()
    return function recur() {
        let current;
        while (!(current = iter.next()).done) {
            const element = current.value;
            // promise 일 수 있는 상황
            if (element instanceof Promise) return element.then(a => {
                result.push(a)
                return result.length === l ? result : recur()
            }) 
            result.push(element)
            if (result.length === l) return result
        }
        return result
    }()
})
go(
    [1, 2, 3, 4],
    // [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
    // Lmap(a => a + 10),
    L.map(a => a + 10),
    // L.map(a => Promise.resolve(a + 10)),
    // ptake(2),
    takeAll,
    console.log
) // [ 11, 12 ]
