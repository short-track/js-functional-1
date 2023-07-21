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

// go라는 함수를 만들어본다
// 예시는 아래와 같다
// go (
//     0,
//     a => a + 1,
//     a => a + 10,
//     a => a + 100,
//     console.log
// )  -> 111

// go 메서드는 인자들을 차례대로 축약해나간다.
// 즉 console.log(f4(f3(f2(f1(0)))))와 같다.
// 마침 reduce가 이런 동작을 하기 때문에 이용해본다

const go = (...args) => {
    // reduce를 작성할 때 초기 값이 없는 경우도 처리했기 때문에
    // 그냥 사용이 가능하다
    return reduce((a, fn) => fn(a), args)
}

go (
    0,
    a => a + 1,
    a => a + 10,
    a => a + 100,
    console.log
)

// 이번에는 pipe라는 메서드를 만들아본다
// pipe와 go는 축약해나간다는 것은 비슷하지만
// go와는 달리 pipe는 함수를 반환한다

// pipe (
//     0,
//     a => a + 1,
//     a => a + 10,
//     a => a + 100,
//     console.log
// ) // function

const pipe = (...args) => {
    return function(acc) {
        return go(acc, ...args)
    }
}

const pipeFn = pipe (
    a => a + 1,
    a => a + 10,
    a => a + 100
)

console.log(pipeFn) // function
console.log(pipeFn(0)) // 111

// pipe 메서드를 첫번 째 인자로 (a, b) => a + b도 받을 수 있게 수정해본다
const upgradePipe = (f, ...args) => {
    return function(...acc) {
        return go(f(...acc), ...args)
    }
}

const upgradePipeFn = upgradePipe (
    (a, b) => a + b,
    a => a + 10,
    a => a + 100
)

console.log(upgradePipeFn) // function
console.log(upgradePipeFn(2, 3)) // 115

// go 메서드를 이용해 아래 코드를 조금 더 읽기 좋게 개선을 해본다
const products = [
    { name: '반팔티', price: 15000},
    { name: '긴팔티', price: 20000},
    { name: '핸드폰케이스', price: 15000},
    { name: '후드티', price: 30000},
    { name: '바지', price: 25000},
]

const add = (a, b) => a + b

console.log(
    reduce(
        add,
        map(p => p.price, 
            filter(p => p.price >= 20000, products)
        )
    )
)

go (
    products,
    products => filter(p => p.price < 20000, products),
    products => map(p => p.price, products),
    prices => reduce(add, prices),
    console.log)
