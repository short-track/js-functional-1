// 자바스크립트에서 비동기처리 첫번째 콜백
function add10(a, callback) {
    return setTimeout(() => callback(a + 10), 100);
}

add10(5, res => {
    console.log(res)
})

// 자바스크립트에서 비동기처리 두번째 promise
function add20(a) {
    return new Promise(resolve => setTimeout(() => resolve(a + 20), 100))
}

add20(5)
.then(console.log)


// promise의 then을 사용하면 사이사이에 연산을 끼워넣기 좋다
add20(5)
.then(add20)
.then(add20)
.then(console.log)

// callback 패턴은 연산을 추가하면 중첩을해서 작성하기 때문에
// 가독성이 떨어진다
add10(5, res => {
    add10(res, res => {
        add10(res, res => {
            console.log(res)
        })
    })
})

// promise가 callback과의 차이는 비동기 상황을 일급 값으로 처리한다
// 구체적으로 promise는 pending, settled, fail의 상태가 존재한다

// 나는 강의와 다르게 add10에서 settimeout을 return하게 하였는데
// 다음 코드는 출력 값이 존재한다
const callbackReturn = add10(5, res => {
    add10(res, res => {
        add10(res, res => {
            console.log(res)
        })
    })
})
// Timeout {
//     _idleTimeout: 100,
//     _idlePrev: [TimersList],
//     _idleNext: [Timeout],
//     _idleStart: 45,
//     _onTimeout: [Function],
//     _timerArgs: undefined,
//     _repeat: null,
//     _destroyed: false,
//     [Symbol(refed)]: true,
//     [Symbol(kHasPrimitive)]: false,
//     [Symbol(asyncId)]: 6,
//     [Symbol(triggerId)]: 1
//   }
console.log(callbackReturn)

// 그렇다면 callback도 값으로 다루어지니 이런 점에서 promise와의
// 차이는 없는것이 아닌가? (브라우저에서는 다른가?)


// promise 일급 활용
let go1 = (a, f) => f(a)
const add5 = a => a +5;


// 위의 코드는 promise가 아닌 비동기가 아닌 값이
// 들어와야 예상한대로(순서를 예상할 수 있는) 실행된다.
// promis가 들어올 때도 동작할 수 있게 수정을 해본다


const delay100 = a => new Promise(resolve => setTimeout(() => resolve(a), 100))
go1 = (a, f) => f instanceof Promise ? f().then(a) : f(a)
go1(go1(10, add5), console.log)
go1(go1(delay100(10), add5), console.log)

// 여기서 기억할만한 것은 Promise는 일급으로서 비동기 상황을 값으로 다룬다
