// L.map, L.flter를 이용하여 map과 filter 만들기

const { go, L, take, pipe, range } = require("../lib");

const curry = f => 
    (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._)   


// 기존 맵을 수정 1.
// const map = curry((fn, iter) => go(
//     iter,
//     L.map(fn),
//     take(Infinity)
// ))

// 기존 맵을 수정 2.
const map = curry(pipe(L.map, take(Infinity)))

console.log(map(a => a + 10, L.range(4)));

// 이번에는 필터를 바꿔본다
// const filter = curry((f, iter) => {
//     const result = []
//     iter = iter[Symbol.iterator]()
//     let current;
//     while (!(current = iter.next()).done) {
//         const element = current.value;
//         if (f(element)) result.push(element)
//     }
//     return result
// })

const filter = curry(pipe(L.filter, take(Infinity)))
console.log(filter(a => a % 2, range(4)))

// L.flatten을 만들어 본다
// 증첩된 배열을 중첩을 제거한 상태를 반환한다

const isIterable = a => a && a[Symbol.iterator]

const lazyFlatten = function *(iter) {
    for (const element of iter) {
        if (isIterable(element)) for (const b of element) yield b;
        else yield element;
    }
}

const flatten = pipe(lazyFlatten, take(Infinity))


const it = flatten([[1, 2], 3, 4, [5, 6], [7, 8, 9]])
// console.log(it.next())
// console.log(it.next())
// console.log(it.next())
// console.log(it.next())

// flatmap
console.log([[1, 2], 3, 4, [5, 6], [7, 8, 9]].flatMap(a => a))
// [1, 2, 3, 4, 5, 6, 7]

const lazyFlatMap = curry(pipe(L.map, lazyFlatten))
const flatMap = curry(pipe(L.map, flatten))
const it1 = lazyFlatMap(a => a, [[1, 2], 3, 4, [5, 6], [7, 8, 9]])

console.log(it1.next()) // { value: 1, done: false }
console.log(it1.next()) // { value: 2, done: false }
console.log(it1.next()) // { value: 3, done: false }
console.log(it1.next()) // { value: 4, done: false }
console.log(it1.next()) // { value: 5, done: false }
console.log(it1.next()) // { value: 6, done: false }

console.log(flatMap(L.range, [1, 2, 3]))
console.log(flatMap(range, map(a => a + 1, [1, 2, 3])))


