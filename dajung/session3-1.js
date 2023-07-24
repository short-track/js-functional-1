// 함수형에서 자주 사용하는 map을 구현해보자
// map의 스펙(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)은 다음과 같다

// The map() method creates a new array populated with the results of calling 
// a provided function on every element in the calling array.

// map(callbackFn)
// map(callbackFn, thisArg)

// 1. 새로운 배열을 반환한다
// 2. 콜백과 iterable한 값을 받는다

const products = [
    { name: '반팔티', price: 15000},
    { name: '긴팔티', price: 20000},
    { name: '핸드폰케이스', price: 15000},
    { name: '후드티', price: 30000},
    { name: '바지', price: 25000},
]

const map = (fn, arg) => {
    const result = []

    for (const element of arg) {
        result.push(fn(element))
    }
    return result
}

// map이 추상화가 된 이유는 실제로 동작하는 부분은 인자(fn)로 받아서
// 실행된 결과만 받기 때문이다. 즉 내부 동작은 모른다

// 상품의 이름을 수집하는 메서드
console.log(map(p => p.name, products)) // [ '반팔티', '긴팔티', '핸드폰케이스', '후드티', '바지' ]

// 상품의 가격을 수집하는 메서드
console.log(map(p => p.price, products)) // [ 15000, 20000, 15000, 30000, 25000 ]

// map은 iterable 프로토콜을 따르기 때문에 다형성이 높다.
// 즉 ierable이기만 하다면 무엇이든 사용이 가능하다는 뜻이다.

// dom 객체를 사용할 수 있다.  단, 아래 예시는 브라우저에서만 실행 가능
// console.log(map(el => el.nodeName, document.querySelectorAll("*")));

// generator를 사용할 수 있다.
function *gen() {
    yield 2;
    yield 3;
    yield 4;
}

console.log(map(a => a * a, gen())) // [4, 9, 16]

// 당연하게 배열도 가능하다
console.log(map(a => a * a, [1, 2, 3])) // [1, 4, 9]

// Map 자료형도 가능
let m = new Map([['a', 10], ['b', 20]])

console.log(map(([k, v]) => [k, v * 2], m)) // [ [ 'a', 20 ], [ 'b', 40 ] ]

// Set 자료형도 가능
let s = new Set([1, 2, 3])

console.log(map(e => e * e, s)) // [ 1, 4, 9 ]


// 필터도 만들어보자
const filter = (fn, arg) => {
    const result = []

    for (const element of arg) {
        if (fn(element)) result.push(element)
    }

    return result
}

// 2만원 이상인 상품만 수집
console.log(filter(p => p.price >= 20000, products))
// [
//     { name: '긴팔티', price: 20000 },
//     { name: '후드티', price: 30000 },
//     { name: '바지', price: 25000 }
// ]

// 이름이 네 글자 이상인 상품만 수집
console.log(filter(p => p.name.length > 3, products)) // [ { name: '핸드폰케이스', price: 15000 } ]
