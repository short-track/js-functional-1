import {log, reduce, map, filter} from '../common.js';
const add = (a, b) => a + b;

/*
[불만!]
유인동 강사의 코드가 어렵게 느껴지는 이유중 하나가
 - 너무 코드를 줄인다!
 - 변수명이 구리다

[해결!]
각 코드를 풀어 쓰고, 변수명을 바꿔보자
*/
// -------------------------------------
// reduce 함수
/*
    첫번째 인자 - 함수
    두번째 인자 - 초기값
    세번째 인자 - 이터러블

    초기값이 없을 경우 두번째 인자에는 이터러블을 넘긴다. 이터러블의 첫 값을 초기값으로 셋팅한다
    내부에서
    1. 이터러블을 순히하면서
    2. 함수를 실행한다
    3. 함수의 결과를 다음 함수의 인자로 넘긴다
    4. 최종 결과를 리턴한다
*/
log(reduce(add, 0, [1, 2, 3, 4, 5]));
log(reduce(add, [1, 2, 3, 4, 5]));

// [정리 1]
// go 함수
// 인자를 받아 결과를 바로 산출해내는 함수
// 내부적으로 reduce 함수를 사용한다
/*
    첫번째 인자 - 초기값
    나머지 인자s - 함수들
*/
const go = (init, ...fns) => {
    return reduce((acc, fn) => fn(acc), [init, ...fns]);
}

go(
    add(0, 1),
    a => a + 10,
    a => a + 100,
    log);

// [정리 2]
// pipe 함수
// 인자를 받아 최종 함수를 리턴하는 함수
// 내부적으로 go 함수를 사용한다
/*
    인자s - 함수들
*/
const pipe = (f, ...fns) => {
    return (...args) => {
        const init = f(...args);
        return go(init, ...fns)
    }
}

const f = pipe(
    (a, b) => a + b,
    a => a + 10,
    a => a + 100);

log(f(0, 1));


// [정리 3]
// curry 함수
// 함수를 받아놨다가, 원하는 시점에 평가를 하도록 지연시키는 함수. 여러 인자가 필요한데, 한개씩만 받아서 평가를 지연하도록 하는 함수
/*
    인자 - 함수
    결과 - 커리를 적용한 함수
*/
const curry = fn => {
    return (init, ...args) => {
        return args.length ? fn(init, ...args) : (...args) => fn(init, ...args);
    }
}
const mult = curry((a, b) => a * b);
const mult3 = mult(3);
log(mult3(2));
log(mult3(5));


// [정리 4]
// 함수를 개선시켜나가기
// -> 함수체인
// -> go 함수 활용
// -> curry 함수 활용

const products = [
    {name: '반팔티', price: 15000},
    {name: '긴팔티', price: 20000},
    {name: '핸드폰케이스', price: 15000},
    {name: '후드티', price: 30000},
    {name: '바지', price: 25000}
];

/*
    원래는 아래와 같이 정리한다
    reduce 특성상
    - map은 iter으로 처리되고, filter의 결과값을 받아서 처리한다
    - 매 순회마다 add 연산을 처리한다
    - 즉 읽는/처리되는 순서가 filter -> map -> add -> reduce 이다
*/
log(
    reduce(
        add,
        map(p => p.price,
            filter(p => p.price < 20000, products))));

/*
    go 함수를 사용하면 아래와 같이 정리할 수 있다

    - 읽는 순서가 왼쪽에서 오른족으로 읽는다.
    - 초기값 products를 넘기고,
    - 순차적으로 함수들을 filter -> map -> reduce를 처리한다

    훨씬 읽기 쉽다.
*/
go(
    products,
    products => filter(p => p.price < 20000, products),
    products => map(p => p.price, products),
    prices => reduce(add, prices),
    log);

/*
    curry 함수를 적용한 filter, map, reduce 함수를 사용하면 아래와 같이 정리할 수 있다

    - 큰 차이점은 함수가 선언이 아닌 실행을 한번 하고, 최종실행을 지연을 시킨 채로 넘기고 있다.
    - 커리가 적용되었기 때문에, 각 함수들은 products 또는 prices를 아직 받지 않은 상태이다
    - 즉, 최종 인자 products 또는 prices를 받기까지 평가가 지연되고 있다.
    - 덕분에 아래와 같이 읽기 쉬운 코드를 작성할 수 있다.
*/

go(
    products,
    filter(p => p.price < 20000),
    map(p => p.price),
    reduce(add),
    log);


// [정리 5]
// 함수 조합

const total_price = pipe(
    map(p => p.price),
    reduce(add));

const base_total_price = fn => pipe(
    filter(fn),
    total_price);

go(
    products,
    base_total_price(p => p.price < 20000),
    log);