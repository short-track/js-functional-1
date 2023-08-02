// 아래 코드는 go 메서드 안에 Promise가 섞여 있고
// 실행하면 예상하지 못한 결과가 나온다.
// 비동기 처리도 제대로 할 수 있는 go, pipe
// 메서드를 만들어 본다
const { go, curry } = require('../lib')
go(
    1,
    a => a + 10,
    a => Promise.resolve(a + 100),
    a => a + 1000,
    console.log
) // [object Promise]1000


// 비동기 상황을 값으로 처리하는 Promise를
// go, pipe, reduce 적용
// pipe는 go로 이루어져있고 go는
// reduce로 이루어져있기 때문에
// reduce만 비동기 처리가 되면 나머지도 해결된다.
const reduce1 = curry((fn, acc, iter) => {
    if (!iter) {
        iter = acc[Symbol.iterator]()
        acc = iter.next().value
    } else {
        iter = iter[Symbol.iterator]()
    }

    let current;
    
    while (!(current = iter.next()).done) {
        const element = current.value;
        // promise가 실행되는 구간
        // 만약에 acc가 promise면 
        // acc = fn(acc, element)
        acc = acc instanceof Promise ? acc.then(acc => f(acc, a)) : f(acc, a)
    }
    return acc
})

// 위의 새로 작성한 코드는 아쉬운 점이 한가지 있다.
// Promise이외의 코드도 promise 체인 때문에 비동기 처리를 한다
// 이제 이 부분을 재귀를 이용하여 고쳐 본다

const reduce2 = curry((fn, acc, iter) => {
    if (!iter) {
        iter = acc[Symbol.iterator]()
        acc = iter.next().value
    } else {
        iter = iter[Symbol.iterator]()
    }

    return function recur(acc) {
        let current;
    
        while (!(current = iter.next()).done) {
            const element = current.value;
            // promise가 실행되는 구간
            // 만약에 acc가 promise면 
            acc = fn(acc, element)
            if (acc instanceof Promise ) return acc.then(recur);

        }
        return acc;
    } (acc);
})

// 마지막으로 첫 번째로 들어가는 인자가 promise일 경우를 처리해 본다
const go1 = (a, f) => a instanceof Promise ? a.then(f) : f(a) 
const reduce3 = curry((fn, acc, iter) => {
    if (!iter) {
        iter = acc[Symbol.iterator]()
        acc = iter.next().value
    } else {
        iter = iter[Symbol.iterator]()
    }

    return go1(acc, function recur(acc) {
        let current;
    
        while (!(current = iter.next()).done) {
            const element = current.value;
            // promise가 실행되는 구간
            // 만약에 acc가 promise면 
            acc = fn(acc, element)
            if (acc instanceof Promise ) return acc.then(recur);

        }
        return acc;
    });
})

go(
    Promise.resolve(1),
    a => a + 10,
    a => Promise.reject('error~~~'),
    a => console.log('------'),
    a => a + 1000,
    a => a + 10000,
    console.log
).catch(a => console.log(a))
// 1111
// error~~~

// Promise.then 의 특징
// Promise가 여러 개 중첩되어 있어도 then에서 한번에 처리가 가능하다
// 이것으로 원한는 곳에서 한번에 then으로 추가해서 사용할 수 있다
Promise.resolve(Promise.resolve(Promise.resolve(1))).then(console.log)

new Promise(resolve => resolve(new Promise(resolve => resolve(1)))).then(console.log)
