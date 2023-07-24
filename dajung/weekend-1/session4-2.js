// 이번에는 curry라는 함수를 만들어본다
// 이 함수는 필요한 인자들을 받아서 원하는 시점에 실행시킬 수 있게 한다
const { map, filter, reduce, go, pipe } = require('./lib')

const curry = f => 
    (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._) 

const mult = curry((a, b) => a * b)
const mult1 = mult(1)
console.log(mult1) // function
console.log(mult1(2)) // 2

// 이번에는 go를 사용했던 코드를 더 개선해본다
const products = [
    { name: '반팔티', price: 15000},
    { name: '긴팔티', price: 20000},
    { name: '핸드폰케이스', price: 15000},
    { name: '후드티', price: 30000},
    { name: '바지', price: 25000},
]

const add = (a, b) => a + b

go (
    products,
    products => filter(p => p.price < 20000, products),
    products => map(p => p.price, products),
    prices => reduce(add, prices),
    console.log
)

// 먼저 filter, map, reduce에 curry를 적용한다
const c_map = curry(map)
const c_filter = curry(filter)
const c_reduce = curry(reduce)

// 그리고 적용한다
go (
    products,
    c_filter(p => p.price < 20000),
    c_map(p => p.price),
    c_reduce(add),
    console.log
)

// 이번에는 pipe를 이용하여 중복된 함수를 분리해본다
// 예를 들어 아래의 두 코드가 있다고 가정해본다
go (
    products,
    c_filter(p => p.price < 20000),
    c_map(p => p.price),
    c_reduce(add),
    console.log
)
go (
    products,
    c_filter(p => p.price < 20000),
    c_map(p => p.price),
    c_reduce(add),
    console.log
)

// 여기서 c_map과 c_reduce를 분리해본다
const total_price = pipe(
    c_map(p => p.price),
    c_reduce(add),
)

// total_price 적용
go (
    products,
    c_filter(p => p.price < 20000),
    total_price,
    console.log
)
go (
    products,
    c_filter(p => p.price < 20000),
    total_price,
    console.log
)
