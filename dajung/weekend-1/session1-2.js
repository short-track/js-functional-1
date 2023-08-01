// sessions 1 - 1에서 iterable 프로토콜을 준수하면
// 다른 말로 Symbol.iterator 속성을 갖고 있다면 사용자 정의 iterable 객체를 만들 수 있다
const customIterable = {
    [Symbol.iterator]() {
        let i = 3;
        return {
            next() {
                return i === 0 ? {done: true} : {value: i--, done: false}
            }
        }
    }
}

for (const a of customIterable) {
    console.log(a) // 3, 2, 1
}

// array iterator를 자세히 보자
const arr = [1, 2, 3]
let arrIterator = arr[Symbol.iterator]()
arrIterator.next()
console.log(arrIterator[Symbol.iterator]() === arrIterator) // true

// next를 실행한 결과 값에 iterator가 arr의 이터레이터다
// 이렇게 하면 좋은 점이 next로 진행한 상황을 기억할 수 있고 
// 동시에 처음부터 다시 반복을 할 수 있다.

console.log(arrIterator.next()) // { value: 2, done: false }

for (const current of arrIterator) {
    console.log(current) // 3
}

for (const current of arr) {
    console.log(current) // 1, 2, 3 순서는 3, 2, 1이 되어야 하는게 아닌가??
}

// 이렇게 다양하게 사용할 수 있게하려면 반환 값에 Symbol.iterator를 정의해줘야 한다
const newCustomIterable = {
    [Symbol.iterator]() {
        let i = 3;
        return {
            next() {
                return i === 0 ? {done: true} : {value: i--, done: false}
            },
            [Symbol.iterator]() {
                return this;
            }
        }
    }
}
const customIterator = newCustomIterable[Symbol.iterator]()
console.log(customIterator.next()) // { value: 3, done: false }

for (const current of customIterator) {
    console.log(current) // 2, 1
}

for (const current of newCustomIterable) {
    console.log(current) // 3, 2, 1
}

// 전개 연산자도 iterable 프로토콜을 사용한다
const spreadArr = [1, 2, 3]
spreadArr[Symbol.iterator] = null
console.log(...spreadArr) // TypeError: Found non-callable @@iterator

// 전개 연산자로 다양한 자료형을 하나로 묶을 수 있는 이유는
// 여러 자료형들과 전개 연산자가 iterable 프로토콜을 사용하고 있기 때문이다
const map = new Map([['a', 1]])
const set = new Set([2])
const ar = [4]

console.log([...map, ...set, ...ar]) // [ [ 'a', 1 ], 2, 4 ]
