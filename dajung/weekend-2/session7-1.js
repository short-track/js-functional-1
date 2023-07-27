// reduce와 take는 결과를 만드는 함수이다.
// 다른 말로 필요한 값들을 꺼내서 실행하는 역할을 한다
// map, filter는 지연성을 갖고 reduce와 take는 실행을 하는 속성을 갖는다
// 힘수형으로 프로그래밍 할 때 이 내용을 기억하면서 사용할 함수를 고르면 좋다

const { go, map, reduce, curry, L, filter, take } = require("../lib");

// 예를 들어 다음을 코드를 작성해본다(객체를 통해 쿼리 스트링을 만드는 메서드)
// spec
// const queryStr = obj => obj;
// console.log(queryStr({ limit: 10, offset: 10, type: 'notice'}))

// 먼저 위의 값이 들어올 때 키와 값을 추출한다
// 하나의 키, 값을 = 으로 연결한다
// 키 값들의 쌍을 &으로 연결한다
const queryStr = obj => go (
    obj,
    Object.entries,
    map(([k, v]) => `${k}=${v}`),
    reduce((a, b) => `${a}&${b}`)
)

console.log(queryStr({ limit: 10, offset: 10, type: 'notice'}))

// 이제 array prototype에 있는 join을 만들어 본다
const join = curry((sep = ',', iter) =>
    reduce((a, b) => `${a}${sep}${b}`, iter))

// 위의 join은 내부에 reduce를 사용하기 때문에
// iterable의 속성을 가진 데이터를 모두 다룰 수 있다
// 이것은 다른 말로 generator도 사용이 가능하며 지연 평가가 가능하다는 이야기이다 

function *a() {
    yield 10;
    yield 11;
    yield 12;
    yield 13;
}

console.log(join(' - ', a())) // 10 - 11 - 12 - 13

const joinQueryStr = obj => go (
    obj,
    Object.entries,
    L.map(([k, v]) => `${k}=${v}`),
    join('&')
)

// limit=10&offset=10&type=notice
console.log(joinQueryStr({ limit: 10, offset: 10, type: 'notice'}))

// take를 이용하여 결과를 만드는 find를 만들어 본다
const users = [
    {age:32},
    {age:31},
    {age:37},
    {age:28},
    {age:25},
    {age:32},
    {age:31},
    {age:37}
]

const find = (f, iter) => go(
    iter,
    filter(f),
    take(1),
    ([a]) => a
)

console.log(find(u => u.age < 30, users))

// 위의 find는 아쉬운 점이 filter에서 모든 값을 계산하는 것이다.
// 더 효율적으로 하려면 지연 평가로 바꾼다

const lazyFind = curry((f, iter) => go(
    iter,
    L.filter(f),
    take(1),
    ([a]) => a
))

console.log(lazyFind(u => u.age < 30)(users))
