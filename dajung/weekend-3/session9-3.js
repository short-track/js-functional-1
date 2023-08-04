// 지연된 함수를 병렬적으로 수행하기
const { go, L, reduce, curry, take, pipe } = require('../lib')

const delay1000 = a => {
    console.log('hi')
    return new Promise(resolve => setTimeout(() => resolve(a), 1000))
}
const add = (a, b) => a + b;


// 아래의 코드는 1개씩 실행을 한다. 만약 이 값들을 동시에 계산한다면
// 부하는 생기겠지만 빠르게 최종 결과를 낼 수 있다
go(
    [1, 2, 3, 4, 5],
    L.map(a => delay1000(a * a)),
    // L.filter(a => a % 2),
    // L.filter(a => a % 2),
    // L.filter(a => a % 2),
    // L.filter(a => a % 2),
    // L.filter(a => a % 2),
    // L.filter(a => a % 2),
    L.filter(a => a % 2),
    reduce(add),
    console.log
)

// 따라서 병렬적으로 실행할 수 있는 C(consurrency) 메서드를 만들어 본다
const C = {}
const noop = function() {}
const catchNoop = arr =>
    (arr.forEach(a => a instanceof Promise ? a.catch(noop) : a), arr)
C.reduce = curry((f, acc, iter) => iter ? 
    reduce(f, acc, [...iter]) :
    reduce(f, [...acc]))

// console.time('')
go(
    [1, 2, 3, 4, 5],
    L.map(a => delay1000(a * a)),
    // L.filter(a => a % 2),
    // L.filter(a => a % 2),
    // L.filter(a => a % 2),
    // L.filter(a => a % 2),
    // L.filter(a => a % 2),
    // L.filter(a => a % 2),
    L.filter(a => a % 2),
    C.reduce(add),
    console.log,
    // _ => console.timeEnd('')
) // C.reduce : 1005.570ms, reduce : 5011.179ms

// 아래와 같은 코드는 reject에 대한 내용을 출력한다.
// 정상적으로 동작해서 불필요한 console.log를 없애 보려고 한다
// console.time('')
// go(
//     [1, 2, 3, 4, 5, 6, 7, 8, 9],
//     L.map(a => delay1000(a * a)),
//     // L.filter(a => a % 2),
//     // L.filter(a => a % 2),
//     // L.filter(a => a % 2),
//     // L.filter(a => a % 2),
//     // L.filter(a => a % 2),
//     // L.filter(a => a % 2),
//     L.filter(a => a % 2),
//     L.map(a => delay1000(a * a)),
//     C.reduce(add),
//     console.log,
//     _ => console.timeEnd('')
// ) // C.reduce : 1005.570ms, reduce : 5011.179ms

C.reduce = curry((f, acc, iter) => {
    const iter2 = catchNoop(iter ? [...iter] : [...acc])
    return iter ? 
        reduce(f, acc, iter2) :
        reduce(f, iter2)
})

console.time('')
go(
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    L.map(a => delay1000(a * a)),
    // L.filter(a => a % 2),
    // L.filter(a => a % 2),
    // L.filter(a => a % 2),
    // L.filter(a => a % 2),
    // L.filter(a => a % 2),
    // L.filter(a => a % 2),
    L.filter(a => a % 2),
    L.map(a => delay1000(a * a)),
    // reduce(add),
    C.reduce(add),
    console.log,
    _ => console.timeEnd('')
) // C.reduce : 2005.624ms, reduce : : 14025.972ms

// 이제 take도 비슷한 효과를 내게 수정한다
C.take = curry((l, iter) => take(l, catchNoop([...iter])))

go(
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    L.map(a => delay1000(a * a)),
    // L.filter(a => a % 2),
    // L.filter(a => a % 2),
    // L.filter(a => a % 2),
    // L.filter(a => a % 2),
    // L.filter(a => a % 2),
    // L.filter(a => a % 2),
    L.filter(a => a % 2),
    L.map(a => delay1000(a * a)),
    // reduce(add),
    // C.reduce(add),
    C.take(2),
    console.log,
) // [1, 81]

// C.map과 C.filter를 만들기
C.takeAll = C.take(Infinity)

C.map = curry(pipe(L.map, C.takeAll))
C.filter = curry(pipe(L.filter, C.takeAll))

C.map(a => delay1000(a * a), [1, 2, 3, 4]).then(console.log) // [ 1, 4, 9, 16 ]
C.filter(a => delay1000(a % 2), [1, 2, 3, 4]).then(console.log) // [ 1, 3 ]

