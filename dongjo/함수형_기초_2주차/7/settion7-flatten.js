const isIterable = a => a && a[Symbol.iterator];

L.flatten = function* (iter) {
    for (const a of iter) {
        if (isIterable(a)) for (const b of a) yield b
        else yield a;
    }
};

var it = L.flatten([[1, 2], 3, 4, [5, 6], [7, 8, 9]]);


// 이 코드는
L.flatten = function* (iter) {
    for (const a of iter) {
        if (isIterable(a)) for (const b of a) yield b
        else yield a;
    }
};

// `yield *iterable`를 사용하면, 더 간단하게 표현될 수 있습니다.
// yield *iterable 표현은 
// for (const val of iterable) {
//    yield val;
// }
// 과 같은 표혖입니다.
L.flatten = function* (iter) {
    for (const a of iter) {
        if (isIterable(a)) yield* a;
        else yield a;
    }
};


// ## L.deepFlat
L.deepFlat = function* f(iter) {
    for (const a of iter) {
        if (isIterable(a)) yield* f(a);
        else yield a;
    }
};
log([...L.deepFlat([1, [2, [3, 4], [[5]]]])]);
// [1, 2, 3, 4, 5];