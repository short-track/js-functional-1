// reduce는 값을 축약 또는 누적하는 함수라고 할 수 있다.
// 아래 두 console.log의 결과와 동작 방식은 같아야한다

const add = (a, b) => a + b

// console.log(reduce(add, 0, [1, 2, 3, 4, 5])) // 15
console.log(add(add(add(add(add(0, 1), 2), 3), 4), 5)) // 15

// reduce를 구현하면 다음과 같다.

/**
 * 
 * @param {Function} fn 실제로 계산하는 보조 함수
 * @param {?} acc 누적되는 값
 * @param {?} iter iterator
 */
const reduce = (fn, acc, iter) => {
    for (const element of iter) {
        acc = fn(acc, element)
    }
    return acc
}

// reduce의 동작 가운데 하나는 초기 init 값이 없다면
// iter의 첫번째 값을 init에 넣는 것이다.
// 예를 들어 아래 두 console.log에 찍히는 값은 같다
console.log(reduce(add, [1, 2, 3, 4, 5])) // 15
console.log(reduce(add, 1, [2, 3, 4, 5])) // 15

const reduce1 = (fn, acc, iter) => {
    // 첫 번째 console의 내용
    // acc에 iter가 들어왔을 때
    if (!iter) {
        iter = acc[Symbol.iterator]()
        acc = iter.next().value
    }
    for (const element of iter) {
        acc = fn(acc, element)
    }
    return acc
}

// 누적하는 예시를 살펴본다
// 상품들의 가격 총합
const products = [
    { name: '반팔티', price: 15000},
    { name: '긴팔티', price: 20000},
    { name: '핸드폰케이스', price: 15000},
    { name: '후드티', price: 30000},
    { name: '바지', price: 25000},
]

console.log(
    reduce(
        (total_price, product) => total_price + product.price,
        0,
        products
        ))