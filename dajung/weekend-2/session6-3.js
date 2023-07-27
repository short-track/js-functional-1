const { go, L, take, range, map, filter } = require('../lib')

// L.range, L.map, L.filter, take 가운데 어떤 것이 먼저 실행될까
go(
    L.range(10),
    L.map(n => n + 10),
    L.filter(n => n % 2),
    take(2),
    console.log
)

// 위의 코드는 다음의 순서를 따른다.
// L이 붙은 느긋한 연산은 계산하지 않고 다음으로 넘긴다.
// 즉시 계산하는 take가 실행된다. take는 느긋한 연산 필터의 iterator를 받는다.
// filter의 느긋한 연산은 map의 iterator를 받기 때문에 map으로 넘어가고
// map은 range로 넘긴다. range는 넘기는 곳이 없기 때문에 즉 계산을 해야하기 때문에
// yeild가 실행되고 0을 넘긴다. 이제 map은 0을 받아서 계산을 하게되고
// 마찬가지로 filter가 값을 받기 때문에 실행을 한다


// go(
//   4  5 L.range(10),
//   3  6 L.map(n => n + 10),
//   2  7 L.filter(n => n % 2),
//   1  8  take(2),
//   반복 후 마지막으로 console.log 실행 
//         console.log
// )

// 일반 계산과 느긋한 계산의 성능을 비교해 본다
console.time('normal')
go(
    range(100000),
    map(n => n + 10),
    filter(n => n % 2),
    take(2),
    console.log
)
console.timeEnd('normal')

console.time('L')
go(
    L.range(Infinity),
    L.map(n => n + 10),
    L.filter(n => n % 2),
    take(2),
    console.log
)
console.timeEnd('L')

// normal: 42.571ms
// L: 0.208ms

// 위와 같은 차이가 나는 이유는 일반 계산의 경우 10만개의 값을 전부
// 만들고 나서야 다음 메서드가 실행이 된다.
// 느긋한 계산은 전부 만들지 않고 모든 메서드가 위에서 설명한 느긋한 계산 순서로 계산을 하기 때문에
// take로 2개만 구하면 종료되어 훨씬 빠르다

//  map, filter 계열의 메서드는 결합 법칙의 효과가 있다.
// 일반 계산처럼 모든 것을 끝내고 다음으로 넘어가나 
// 다음으로 넘기면서 계산을 미루면서 실행하나 결과는 같다.(물론 말도안되게 순서를 바꾸지 않는 한)

// 예를 들어 아래 두 계산 순서로 계산을 해도 결과는 같가
// 1. [0, 1, 2, 3, 4, 5, 6, 7, 8, ...]
// 2. [10, 11, 12, ...]
// 3. [11, 13, 15 ...]
// 4. [11, 13]

// 1. 0
// 2. 10
// 3. false 
// 1 ~ 3 반복

// 이러한 지연 평가는 예전에 자바스크립트에서는
// 특정 라이브러리에서만 사용이 가능했다면 ES6에서는 약속된
// 이터러블:이터레이터 프로토콜을 사용하기 때문에
// 서로 다른 라이브러리, 서로 다른 사람들이 작성한 메서드들도
// 조합성이 좋고 안전하게 합성이 가능하다
