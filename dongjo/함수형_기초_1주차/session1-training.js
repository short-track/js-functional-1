
/*
    [정리 1]
    세션 1에서 다룬 내용의 핵심은 이터러블(iterable) 프로토콜이다.
    
    이터러블 : 이터레이터를 리턴하는 [Symbol.iterator]() 를 가진 객체
    이터레이터 : { value, done } 객체를 리턴하는 next() 를 가진 객체
    이터러블/이터레이터 프로토콜: 이터러블을 for...of, 전개 연산자 등과 함께 동작하도록한 규약

    - Array, Set, Map은 모두 이터러블 프로토콜을 따르고 있다.
    - document.querySelectorAll('*') 같은 유사배열도 이터러블 프로토콜을 따르고 있다.
*/

/*
    [정리 2]
    이터러블 인지 아닌지를 확인하려면, 아래와 같이 Symbol.iterator를 확인하면 된다.

    console.log(Symbol.iterator in obj)
    console.log(obj[Symbol.iterator]() == obj);
*/

/*
    [정리 3]
    내장형 이터러블이 있다.
    - Array, Set, Map, String, TypedArray, arguments, NodeList

    내장형 이터러블이 아닌 것들은 이터러블이 아니다.
    하지만 커스텀 이터러블을 만들 수 있다.
*/

// 객체는 이터러블이 아니다
// TypeError: rules is not iterable
const rules1 = {
    "출석": "참석하기",
    "학습": "결과물 제출하기",
};
for (const obj of rules1) {
    console.log(obj);
}

/*
    [정리 4]
    커스텀 이터러블을 만들려면 아래와 같이 이터러블 규약에 맞게 구현하면 된다.
    
    - next()
    - {value, done} 을 return
    - 이터레이터에 [Symbol.iterator]() 으로 본인을 return

    해주면 된다.

    - next() 호출 시, {value, done} 가 return 된다.
    - done이 false면 value를 가지고 이터레이터가 계속 진행된다.
    - done이 true면 이터레이터 종료된다.
    - 즉, 무한 호출이 아니라면 next() 에는 done이 true가 되는 조건을 만들어줘야한다.
*/

const rules2 = {
    "출석": "참석하기",
    "학습": "결과물 제출하기",
    [Symbol.iterator]() {
        const keys = Object.keys(this);
        let size = keys.length - 1;
        return {
            next() {
                return size < 0 ? {done: true} : {value: keys[size--], done: false};
            },
            [Symbol.iterator]() {
                return this;
            }
        }
    }
};

for (const obj of rules2) {
    console.log(obj);
}

/*
    [정리 5]
    만약 rules2 에 [Symbol.iterator]() 를 주석처리하면, rules2가 return 하는 이터레이터는 더이상 이터러블이 아니다.
    그러므로 아래의 코드는

    - false
    - TypeError: iter is not iterable 에러가 난다.

    하지만 rules2[Symbol.iterator]() 를 주석처리하지 않으면, rules2가 return 하는 이터레이터는 이터러블이다.
    그러므로 아래의 코드는 정상 동작한다

    - true
    - 학습 출석
*/
let iter = rules2[Symbol.iterator]();
console.log(Symbol.iterator in iter)
for (const a of iter) {
    console.log(a);
}

// 추가로 참고한 블로그
// https://poiemaweb.com/es6-iteration-for-of
