// 즉시, 지연, Promise, 병렬 조합

const { go, map, filter, take, L, C } = require('../lib')

const delay500 = (a, name) => new Promise(resolve => {
    console.log(`${name} : ${a}`)
    setTimeout(() => resolve(a), 500);
})

// 즉시 평가
go(
    [1, 2, 3, 4, 5, 6, 7, 8],
    map(a => delay500(a * a, 'map 1')),
    filter(a => delay500(a % 2, 'filter 2')),
    map(a => delay500(a + 1, 'map 3')),
    take(2),
    console.log,
)

// 지연 평가
go(
    [1, 2, 3, 4, 5, 6, 7, 8],
    L.map(a => delay500(a * a, 'map 1')),
    L.filter(a => delay500(a % 2, 'filter 2')),
    L.map(a => delay500(a + 1, 'map 3')),
    take(2),
    console.log,
)

// 병렬 평가 + 지연 평가, 1
go(
    [1, 2, 3, 4, 5, 6, 7, 8],
    C.map(a => delay500(a * a, 'map 1')),
    L.filter(a => delay500(a % 2, 'filter 2')),
    L.map(a => delay500(a + 1, 'map 3')),
    take(3),
    console.log,
)

// 병렬 평가 + 지연 평가, 2
go(
    [1, 2, 3, 4, 5, 6, 7, 8],
    L.map(a => delay500(a * a, 'map 1')),
    L.filter(a => delay500(a % 2, 'filter 2')),
    L.map(a => delay500(a + 1, 'map 3')),
    C.take(3),
    console.log,
)
