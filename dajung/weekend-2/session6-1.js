const { reduce } = require('../lib')
const add = (a, b) => a + b;
// range 메서드를 구현
// l을 인자로 받고 0부터 l - 1까지의 정수를 배열에 담아서 반환
const range = (l) => {
    // let i = -1;
    // let res = [];

    // while (++i < l) {
    //     res.push(i)
    // }
    // return res
    const result = []

    for (let i = 0; i < l; i += 1) {
        result.push(i)
    }
    return result
}

console.log(range(5)) // [ 0, 1, 2, 3, 4 ]
console.log(range(2)) // [ 0, 1 ]

console.log(reduce(add, range(4))) // 6

// 느긋한 range 구현
const L = {}
L.range = function *(l) {
    let i = -1;
    while(++i < l) {
        yield i;
    }
}

console.log(reduce(add, L.range(4))) // 6

// 일반 연산은 실행을 하면 계산을 전부 끝낸다
// 느긋한 연산은 실행을 해도 계산을 하지 않고 필요할 때, 
// 다시 말해서 이터레이터 순회할 때 계산을 한다.(이 때도 전부 계산하지 않는다)

// 언제 사용해야하는가에 대해서 느긋한 연산은 데이터가 너무 크거나
// 많아서 메모리에 전부 올릴 수 없을 때 사용하면 좋을 것 같다.

// 실행이 얼마나 걸리는지 테스트를 해본다
function test(name, time, f) {
    console.time(name);

    while (time--) f();
    console.timeEnd(name)
}

test('range', 10, () => reduce(add, range(1000000))) // range: 568.691ms
test('L.range', 10, () => reduce(add, L.range(1000000))) // L.range: 421.280ms

// 강의에 나온 만큼의 차이는 안나온다;;;

// take라는 함수를 만들어 본다
// l개 까지의 원소를 받는다
const take = (l, iter) => {
    const result = []
    for (const element of iter) {
        result.push(element)
        if (result.length == l) return result
    }
    return result
}

console.log(take(5, range(100))) // [ 0, 1, 2, 3, 4 ]
console.log(take(5, L.range(100))) // [ 0, 1, 2, 3, 4 ]

// 만약 값이 커지다면 take + L.range가 더 효율적이다.
// 예를 들어 100 만개의 값을 take를 한다고 했을 때
// 일반 range는 먼저 [0,1,.....100000] 개의 배열을 만들고 5개를 얻는다
// 반면에 느긋한 range는 5개만 만들고 5개를 얻기 때문에 불필요한 100만 - 5개의 값을 생성하지 않는다

// take + range: 28.891ms
console.time('take + range')
console.log(take(5, range(1000000)))
console.timeEnd('take + range')

// take + L.range: 0.124ms
console.time('take + L.range')
console.log(take(5, L.range(1000000))) // 또한 무한 값도 가능하다 console.log(take(5, L.range(Infinity)))
console.timeEnd('take + L.range')
