// html로 출력
const { map, filter, reduce, go, pipe, curry } = require('./lib')

const products = [
    { name: '반팔티', price: 15000, quantity: 1},
    { name: '긴팔티', price: 20000, quantity: 2},
    { name: '핸드폰케이스', price: 15000, quantity: 3},
    { name: '후드티', price: 30000, quantity: 4},
    { name: '바지', price: 25000, quantity: 5},
]

const c_map = curry(map)
const c_filter = curry(filter)
const c_reduce = curry(reduce)

go(
    products,
    c_map(p => p.quantity),
    c_reduce((a, b) => a + b),
    console.log
)

// 위의 코드를 아래와 같이 바꿀 수 있다
const total_quantity = products => go(products,
    c_map(p => p.quantity),
    c_reduce((a, b) => a + b))

console.log(total_quantity(products))

// 위의 코드를 pipe를 이용할 수 있다
const total_quantity_pipe = products => pipe(
    c_map(p => p.quantity),
    c_reduce((a, b) => a + b))
console.log(total_quantity(products))

// 전체 가격을 구하는 메서드 total_price
const total_price = pipe(
    c_map(p => p.price * p.quantity),
    c_reduce((a, b) => a + b)
)

console.log(total_price(products))

// total_quantity와 total_price에 더하는 메서드를 add로 분리할 수 있다
const add = (a, b) => a + b

const new_total_quantity_pipe = products => pipe(
    c_map(p => p.quantity),
    c_reduce(add))
console.log(total_quantity(products))


const new_total_price = pipe(
    c_map(p => p.price * p.quantity),
    c_reduce(add)
)

//  new_total_quantity와 new_total_price 모두 전체를 더한다는
// 공통의 기능이 있다. 이것을 sum으로 분리해 본다
const sum = curry((f, iter) => go(
    iter,
    c_map(f),
    c_reduce(add)))

const sum_total_quantity = sum(p => p.quantity)

console.log(sum_total_quantity(products))

const sum_total_price = sum(p => p.quantity * p.price)
console.log(sum_total_price(products))

// curry를 사용하면 함수의 파라미터를 줄일 수 있는 것 같다