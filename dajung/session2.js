// 제네레이터란 이터레이터이자 이터러블을 생성하는 함수

function *gen() {
    yield 1;
    yield 2;
    yield 3;
    return 100;
}

let iter = gen()
console.log(iter[Symbol.iterator]() === iter) // true
console.log(iter.next()) // { value: 1, done: false }
console.log(iter.next()) // { value: 2, done: false }
console.log(iter.next()) // { value: 3, done: false }
console.log(iter.next()) // { value: 100, done: true }

// 주의할 점은 for of를 사용할 때 return 값은 순회하지 않는다
for (const a of gen()) {
    console.log(a) // 1, 2, 3
}

// 제네레이터는 순회를 통제할 수 있다
// 순회할 수 있는 값을 만들 수 있다 -> 어떠한 값도 순회할 수 있다
function *gen2() {
    yield 1;
    if (false) yield 2;
    yield 3;
}
let iter2 = gen2()
console.log(iter2.next()) // { value: 1, done: false }
console.log(iter2.next()) // { value: 2, done: false }
console.log(iter2.next()) // { value: undefined, done: true }
console.log(iter2.next()) // { value: undefined, done: true }

// 홀 수만 반환하는 제네레이터
function *odds() {
    yield 1;
    yield 3;
    yield 5;
}

let oddIter = odds()
console.log(oddIter.next()) // { value: 1, done: false }
console.log(oddIter.next()) // { value: 3, done: false }
console.log(oddIter.next()) // { value: 5, done: false }
console.log(oddIter.next()) // { value: undefined, done: true }

// 무한으로 생성하는 제네레이터
function *infinity(i = 0) {
    while (true) yield i++;
}

const infinityIterator = infinity(0)
console.log(infinityIterator.next()) // { value: 0, done: false }
console.log(infinityIterator.next()) // { value: 1, done: false }
console.log(infinityIterator.next()) // { value: 2, done: false }

// 여기까지 살펴본 이터레이터와 제네레이터의 특징은 지연이 가능하다
// 예를 들어 일반 for 문은 도중에 멈출 수 없다. 실행이 끝나던가 프로그램이 멈추던가
// 둘 중에 하나지만 이터레이터와 제네레이터는 실행을 멈췄다가 다시 시작했다가 유연하게 순회할 수 있다

// 또 다른 장점으로 무한으로 실행하지만 브라우저나 다른 플랫폼에서 속칭 뻗지 않는다
// 데이터가 무한히 커지면 실행이 멈출 수 있는데 ex for 문 100억 번 순회
// 이터레이터와 제네레이터는 위와 같은 이유로 데이터가 커져도 실행하는데 무리가 없다

// l까지 무한 홀 수 순회
function *infinityOdd(l) {
    for (const a of infinity(1)) {
        if (a % 2) yield a;
        if (a == l) return
    }
}

const infinityOddIterator = infinityOdd(5)
console.log(infinityOddIterator.next()) // { value: 1, done: false }
console.log(infinityOddIterator.next()) // { value: 3, done: false }
console.log(infinityOddIterator.next()) // { value: 5, done: false }

// limit값을 만드는 이터레이터
function *limit(l, iter) {
    for (const a of iter) {
        yield a;
        if (a == l) return
    }   
}

// limit을 넘기지 않는다
const limitIter = limit(4, [1, 2, 3, 4, 5, 6])
console.log(limitIter.next()) // { value: 1, done: false }
console.log(limitIter.next()) // { value: 2, done: false }
console.log(limitIter.next()) // { value: 3, done: false }
console.log(limitIter.next()) // { value: 4, done: false }
console.log(limitIter.next()) // { value: undefined, done: true }
console.log(limitIter.next()) // { value: undefined, done: true }

// 전개 연산자, 구조분해 그리고 콜라보
console.log(...odds(10)) // 1, 3, 5
console.log([...odds(10), ...odds(20)]) // 1, 3, 5, 1, 3, 5

const [head, ...tail] = odds(5)
console.log(head) // 1
console.log(tail) // [3, 5]

const [a, b, ...rest] = odds(5)
console.log(a) // 1
console.log(b) // 3
console.log(rest) // [5]

// generator를 어디에 사용할 수 있을지 생각해보면 좋을것 같다
