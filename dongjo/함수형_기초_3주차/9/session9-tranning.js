// 세션 9는 지금까지 배운 map, filter, reduce, take 등의 함수들을 Promise와 함께 사용할 수 있도록 개선하는 세션입니다.
// 그리고 더 중요한 것은, 이렇게 각 모듈 함수들 내부에서 Promise(비동기)를 지원하게 되면서,
// 병렬처리가 가능하도록 되었다는 것입니다.

// 이때 병렬처리를 했을 시에 고려할 점들은 있습니다
/*
    - 순서가 보장되지 않아도 될때, 최종 결과만 중요할 때
    - 부하가 걸리는 것을 어느정도 감안할때
    - 병렬처리하면서 외부에 연산을을 맡기고 나는 최종 결과만 받아서 처리하면 될때
    - 네트워크 전송이 많이 되는 것을 어느정도 감안할때
*/

// 간단한 함수를 보면,
/*
    Promise 객체이면, then()을 통해 비동기 처리를 하고, 아니면 그냥 함수를 실행시킵니다.
    이렇게 되면, Promise 객체를 통해 비동기 처리를 하고, 그 결과를 다음 함수에게 전달할 수 있게 됩니다.
*/
const go1 = (a, f) => a instanceof Promise ? a.then(f) : f(a);

// Promise 사용 시, 무시가 필요한 연산처리에 대해서는 nop 처리
const nop = Symbol('nop');

L.filter = curry(function* (f, iter) {
    for (const a of iter) {
      const b = go1(a, f);
      if (b instanceof Promise) yield b.then(b => b ? a : Promise.reject(nop));
      else if (b) yield a;
    }
});