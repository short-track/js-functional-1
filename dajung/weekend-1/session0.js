// 평가란 코드가 계산되는 것을 말함.
console.log(1) // 1
console.log(1 + 2) // 3
// 여기서 전개 연산자나 배열은 선언만 했는데 계산이라고 할 수 있을까?
console.log([1, 2]) // [1, 2] 
console.log([1, 2, ...[3, 4]]) // [1, 2, 3, 4]


// 일급이란 값으로 다룰 수 있다.
// 변수에 담을 수 있다.
// 함수의 인자로 사용될 수 있고 함수의 결과로 사용될 수 있다
const a = 10
const add10 = a => a + 10 // function
const result = add10(a)
console.log(result) // 20

// 위의 말대로라면 일급 + 함수는 함수를 값으로 다룰 수 있고
// 함수의 인자 또는 결과로 사용될 수 있다

// 함수를 변수에 담았다
const add5 = a => a + 5;
console.log(typeof add5) // function

// 함수가 결과로 사용되었다 
const f1 = () => () => 1
console.log(f1()) // [Function]

// 함수를 인자로 다룬다
const apply1 = fn => fn(1)
const add2 = a => a + 2
console.log(apply1(add2)) // 3

const times = (fn, n) => {
    let i = -1;
    while (++i < n) fn(i)
}

times(console.log, 3) // 0, 1, 2, 3
times(a => console.log(a + 10), 3) // 10, 11, 12

// 함수를 만들어서 반환한다
const addMaker = a => b => a + b
const add7= addMaker(7)
console.log(add7(5)) // 12
console.log(add7(10)) // 17

// 여기서 클로저라는 개념이 들어간다.
// 예를 들어 addMaker 함수를 만들어서 반환할 때
// 최종 실행 함수는 b를 인자로 받고 a를 기억하고 있다.
// 다시 말해서 실행할 때 필요한 환경(a의 값)을 기억하고 있다.
