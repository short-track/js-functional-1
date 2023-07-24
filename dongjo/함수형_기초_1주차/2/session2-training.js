const log = console.log
/*
    [정리 1]
    앞서 세션 1에서는 객체를 이터러블로 만드는  방법을 배웠다. 세션 2에서는 함수를 이터러블로 만드는 방법을 배운다.
    이터러블을 생성하는 함수를 제너레이터라고 한다.

    제너레이터 : 이터러블을 생성하는 함수이다.
*/
/*
    [정리 2]
    단순히 함수를 이터레이터로 만들어 보자
    
    객체로 이터레이터를 만들어 보는 것과 차이가 있다면, 
    
    - 함수는 gen() 실행을 시켜야 return 값으로 이터러블을 생성한다.
    - 객체는 객체 자체가 이터러블이다.
*/
const gen1 = (items) => {
    let i = 0;
    return {
        next: () => {
            const done = i >= items.length;
            return { 
                done, 
                value: !done ? items[i++] : undefined
            };
        },
        [Symbol.iterator]() {
            return this
        }
    }
}

const iter1 = gen1([1, 2, 3]);
log(Symbol.iterator in gen1());
log(iter1.next());
log(iter1.next());
log(iter1.next());
log(iter1.next());


/*
    [정리 3]
    하지만 위 방법은 조금 복잡하다. 복잡한 방법밖에 없다면 어쩔수 없지만, 더 간단한 방법이 ES6에서 제공된다.
    바로 yeild를 사용하는 방법이다.

    규칙은 아래와 같다
    - function* 로 선언한다.
    - yield를 사용한다.
    - return을 하면, 해당 값부터는 { value, done: true }가 된다.
*/

function* gen2() {
    yield 1;
    yield 2;
    yield 3;
    return undefined; // 생략가능
}
let iter2 = gen2();
log(Symbol.iterator in gen2());
log(iter2.next());
log(iter2.next());
log(iter2.next());
log(iter2.next());

/*
    [정리 4]
    함수에 이터러블 프로토콜을 접목시킴으로써, 다양한 조합을 할 수 있다.
    
    1. 짝수만 뱉는 함수를 만들어보자 (19이상부터 제한)
    2. 던져진 num의 약수를 구하는 함수를 만들어보자
*/
log("*****************************************")
function* even(limit) {
    let i = 0;
    while (true) {
        const next = i += 2;
        if (next >= limit) return;
        yield next;
    }
}
const iter3 = even(19);
log(iter3.next());
log(iter3.next());
log(iter3.next());
log(iter3.next());
log(iter3.next());
log(iter3.next());
log(iter3.next());
log(iter3.next());
log(iter3.next());
log(iter3.next());

log("getDivisor*****************************************")
function* infinity(i = 0) {
    while (true) yield i++;
}
function* getDivisor(num) {
    for (const n of infinity(1)) {
        if (num < n) return n;
        if (num % n == 0) yield n;
    }
}

for(const a of getDivisor(10)) log(a);
// log(iter5.next());
// log(iter5.next());
// log(iter5.next());
// log(iter5.next());
// let iter4 = gen(isPrime);
// log(iter4.next());
// log(iter4.next());
// log(iter4.next());
// log(iter4.next());
// log(iter4.next());
