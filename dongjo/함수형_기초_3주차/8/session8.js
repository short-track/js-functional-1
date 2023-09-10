
// # Promise
// // ## 일급

function add10(a, callback) {
    setTimeout(() => callback(a + 10), 100);
}

var a = add10(5, res => {
    add10(res, res => {
        add10(res, res => {
        // log(res);
        });
    });
});

// log(a);

function add20(a) {
    return new Promise(resolve => setTimeout(() => resolve(a + 20), 100));
}

var b = add20(5)
.then(add20)
.then(add20)
// .then(log);

// log(b);

// ## 일급 활용


const delay100 = a => new Promise(resolve =>
setTimeout(() => resolve(a), 100));

const go1 = (a, f) => a instanceof Promise ? a.then(f) : f(a);
const add5 = a => a + 5;

const n1 = 10;
// log(go1(go1(n1, add5), log));

const n2 = delay100(10);
// log(go1(go1(n2, add5), log));

// ## Composition

// f . g
// f(g(x))

const g = a => a + 1;
const f = a => a * a;

// log(f(g(1)));
// log(f(g()));

Array.of(1).map(g).map(f).forEach(r => log(r));
[].map(g).map(f).forEach(r => log(r));

Promise.resolve(2).then(g).then(f).then(r => log(r));
new Promise(resolve =>
    setTimeout(() => resolve(2), 100)
).then(g).then(f).then(r => log(r));

// ## Kleisli Composition


// f . g
// f(g(x)) = f(g(x))
// f(g(x)) = g(x)

var users = [
    {id: 1, name: 'aa'},
    {id: 2, name: 'bb'},
    {id: 3, name: 'cc'}
];

const getUserById = id => find(u => u.id == id, users) || Promise.reject('없어요!');

const f2 = ({name}) => name;
const g2 = getUserById;

// const fg = id => f(g(id));

const fg = id => Promise.resolve(id).then(g2).then(f2).catch(a => a);

fg(2).then(log);

setTimeout(function () {
    users.pop();
    users.pop();
    fg(2).then(log);
}, 10);

// ## go, pipe, reduce에서 비동기 제어


go(Promise.resolve(1),
    a => a + 10,
    a => Promise.reject('error~~'),
    a => console.log('----'),
    a => a + 1000,
    a => a + 10000,
    log).catch(a => console.log(a));

// ## promise.then의 중요한 규칙


Promise.resolve(Promise.resolve(1)).then(function (a) {
    log(a);
});

new Promise(resolve => resolve(new Promise(resolve => resolve(1)))).then(log);
