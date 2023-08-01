// 함수 합성이란 수학에서 나오는 합성 함수랑 비슷하다
// 우리가 구현한 go, pipe가 비슷한 내용이라고 할 수 있다.
// 예를 들어 f . g 라는 함수 합성이 있다면 g(x)의 결과가 f(g(x))
// 로 들어간다. 이 때 함수 합성을 안전하게 하는 기법이 있는데
// 그것을 모나드라고 한다. 하지만 자바스크립트는 모나드라는 것이 존재하지 않는다.
// 아래는 모나드가 필요한 예시다
let g = a => a + 1;
let f = a => a * a;

console.log(f(g(1))) // 4
console.log(f(g())) // NaN

// 두 번째 결과 NaN는 함수의 합성으로 나온 예상치 못한 결과이다.
// 현실 세계에서는 이런 경우가 많기 때문에 함수를 합성할 때 안전한 장치가 필요히디

Array.of(1).map(g).map(f).forEach(r => console.log(r)); // 4
[].map(g).map(f).forEach(r => console.log(r)); // 

// 두 번째 코드는 빈 값을 받아서 실행되었지만 NaN를 반환하지 않았다.
// 다시 말해 안전하게 합성되었다. 또 다른 예로는 Promise가 있다
// 그러나 약간 다른 특성이 있다
Promise.resolve(1).then(g).then(f).then(console.log)
Promise.resolve().then(g).then(f).then(console.log)

// 두 번째 코드를 보면 함수를 합성하였지만 NaN를 반환한다.
// 결론을 말하면 Promise는 비동기 상황을 적절하게 합성하는 도구이다
// 특정 상황을 안전하게 합성하기 위한 도구로써 모나드로 말할 수 있다
new Promise(resolve => setTimeout(() => resolve(2), 100))
.then(g).then(f).then(console.log)

// Kleisli Composition이란 예외 상황에서 안전하게 합성하게 하는 규칙
// 현실에서는 상태를 가지고 있고 효과가 발생하기 때문에
// 사이드 이펙트가 발생한다. 즉 함수를 합성해서 사용힐 때
// 예외가 발생할 수 있다(구체적으로 인자가 잘못되었거나, 외부에 의존하는
// 상태에 의해서 정확한 결과를 전달할 수 없는 상태일 때)

// 수학 함수로 나타내면 다음과 같다.
// f . g
// f(g(x)) = f(g(x))
// f(g(x)) = g(x)


// 이제 코드로 작성해본다
const { find } = require('../lib')

const users = [
    {id: 1, name: 'aa'},
    {id: 2, name: 'bb'},
    {id: 3, name: 'cc'},
]

f = ({name}) => name
g = id => find(u => u.id == id, users)

let fg = id => f(g(id));

console.log(fg(2) == fg(2))
// 상황에 따라 이렇게 값이 변하게 되면
users.pop()
users.pop()

// 이 코드는 에러가 발생한다
// console.log(fg(2))

// 이제 안전하게 코드를 합성해본다
// 값이 없으면 reject를 반환
g = id =>
    find(u => u.id == id, users) || Promise.reject('없어요')
// catch로 reject를 잡는다
fg = id => Promise.resolve(id).then(g).then(f).catch(a => a)
fg(2).then(console.log)
