/*
    Promise 는 비동기적인 상황을 다루기 위한 일급이다.
    - 성공 (resolved)
    - 실패 (rejected)
    - 대기 (pending)
    세 가지 상태를 가진다.

    콜벡보다 더 활용도가 높다. Promise 객체를 통해서 비동기 코드에 대한 결과값을 받아 다룰 수 있기 때문이다.
*/
function add20(a) {
    return new Promise(resolve => setTimeout(() => resolve(a + 20), 100));
}

var b = add20(5)
            .then(add20)
            .then(add20)

/*
    비동기적인 상황을 다룰수 있다.
    아래 와 같이 go1 함수를 보면 들어온 a에 대해 Promise 이면 .then() 을 활용한다
*/
const go1 = (a, f) => a instanceof Promise ? a.then(f) : f(a);

/*
    모나드 기법 :
    - 함수 합성을 안전하게 할 수 있게 해주는 기법
    - 함수 합성 시 에러발생이 아닌, 문제가 될 만한 영역에 대해서 안전하게 처리할 수 있게 해준다.

*/

Promise.resolve(2).then(g).then(f).then(r => log(r));