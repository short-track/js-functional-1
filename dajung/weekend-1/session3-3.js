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

const filter = (fn, arg) => {
    const result = []

    for (const element of arg) {
        if (fn(element)) result.push(element)
    }

    return result
}

const reduce = (fn, acc, iter) => {
    if (!iter) {
        iter = acc[Symbol.iterator]()
        acc = iter.next().value
    }
    for (const element of iter) {
        acc = fn(acc, element)
    }
    return acc
}

// 함수형 사고와 함께 map, reduce, filter를 사용해 본다
// 여기서 내가 중요하게 인식한 내용은 데이터를 함수로 표현하는 것이다.

// 예를 들어 값이 20000원 이상의 상품 값을 누적하는 코드를 작성한다고 하면
// 초기 코드는 아래와 같다.
const add = (a, b) => a + b
console.log(
    reduce(
        add,
        // 여기에 상품 데이터가 들어간다.
    )
)

// 위에 상품 데이터에는 구체적으로 상품 가격이고 함수로 바꾼다
console.log(
    reduce(
        add,
        map(p => p.price, products)
    )
)

// 위의 코드에서 products라는 데이터가 있지만 이것을 2만원 이상의
// 가격들이라는 함수로 바꾼다
console.log(
    reduce(
        add,
        map(p => p.price, 
            filter(p => p.price >= 20000, products)
        )
    )
)

// 물론 데이터를 없앨 수는 없지만 최대한 데이터를
// 함수로 바꿔서 사용하는게 포인트 같다
