// 지연성을 가진 L.map을 만들어 본다
const T = {}

T.map = function *(f, iter) {
    for (const a of iter) yield f(a);
}

const it = T.map(a => a + 10, [1, 2, 3])

console.log(it.next().value) // 11
console.log(it.next().value) // 12
console.log(it.next().value) // 13

// 지연성을 가진 L.filter를 만들어 본다
T.filter = function *(f, iter) {
    for (const a of iter) if(f(a)) yield a;
}

const itFilter = T.filter(a => a % 2, [1, 2, 3, 4])

console.log(itFilter.next().value) // 1
console.log(itFilter.next().value) // 3
console.log(itFilter.next().value) // undefined


// 즉시 평가와 지연 평가로 코드를 작성해본다
const { go, range, L, map, filter, take } = require('../lib')

// 즉시 평가
go(
    range(10),
    map(n => n + 10),
    filter(n => n % 2),
    take(2),
    console.log
)

// 지연 평가
go(
    L.range(10),
    L.map(n => n + 10),
    L.filter(n => n % 2),
    take(2),
    console.log
)

// for of를 iterator를 이용한 명령형으로 바꿀 수 있다
// 현재 값을 담을 임시 변수
// let current;
// while (!(current = iter.next()).done) {
//     const a = current.value;
//     // 로직
// }

//  구현한 함수형 메서드의 for of 를 위의 코드로 교체한다
// const map = curry((fn, iter) => {
//     iter = iter[Symbol.iterator]();
//     let current;
//     while (!(current = iter.next()).done) {
//         const element = current.value;
//         result.push(fn(element))
//     }
//     return result
// })
