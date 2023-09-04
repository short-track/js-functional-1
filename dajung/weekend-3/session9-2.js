const { L, take, go, takeAll } = require('../lib')

// Promise와 지연 평가가 가능하게 함수를 수정해 본다 
go(
    [1, 2, 3, 4, 5, 6],
    L.map(a => Promise.resolve(a * a)),
    L.filter(a => {
        // Promise { number }
        // 따라서 filter 부분을 수정해야한다
        console.log(a)
        return a % 2;
    }),
    L.map(a => {
        console.log(a);
        return a * a
    }),
    take(4),
    console.log
)

// lib.js filter
L.filter = curry(function *(f, iter) {
    for (const element of iter) {
        // go1로 처리해서 promise를 처리한다
        const b = go1(element, f)
        // Promise 일 경우에 따라
        // 아래의 코드를 추가하지 않으면 지연 평가가 제대로 동작하지 않는다
        // 특정 구분 값(여기서는 nop)을 전달해야 이 값을 catch에서 확인하고 아무일도 하지 않고
        // 다음 동작을 취소하게 할 수 있다 예를 들어 catch에서 들어온 값이 nop일 때 Promise.reject
        if (b instanceof Promise) yield b.then(b => b ? element : Promise.reject(nop))
        else if (b) yield element
    }
})

// take에서는 nop이라는 구분자를 확인한다
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
                // nop 일 경우 반복하지 않고 작업을 취소한다
                .catch(e => e == nop ? recur() : Promise.reject(e))
            }
            result.push(element)
            if (result.length === l) return result
        }
        return result
    }()
})


// 이번에는 reduce에 nop을 적용해본다
const go1 = (a, f) => a instanceof Promise ? a.then(f) : f(a)

const reduceF = (acc, a, f) => 
    // nop 확인
    a instanceof Promise ? 
        a.then(a => f(acc, a), e => e == nop ? acc : Promise.reject(e)) :
       f(acc, a)

const head = iter => go1(take(1, iter), ([h]) => h)

const reduce = curry((fn, acc, iter) => {
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

// 만약 지연 평가와 비동기 처리를 접합하지 않았다면
// 비동기 처리를 전부 하고 take가 실행되게 된다

// go(
//     [1, 2, 3, 4, 5, 6, 7, 8],
//     L.map(a => new Promise(resolve => setTimeout(() => resolve(a * a), 1000))),
//     L.filter(a => a % 2),
//     // take(2),
//     takeAll,
//     console.log
// )
