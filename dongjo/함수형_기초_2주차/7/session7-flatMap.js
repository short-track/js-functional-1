L.flatMap = curry(pipe(L.map, L.flatten));

var it = L.flatMap(map(a => a * a), [[1, 2], [3, 4], [5, 6, 7]]);
var it = L.flatMap(a => a, [[1, 2], [3, 4], [5, 6, 7]]);

// ## 2차원 배열 다루기
const arr = [
    [1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [9, 10]
  ];

go(arr,
    L.flatten,
    L.filter(a => a % 2),
    L.map(a => a * a),
    take(4),
    reduce(add),
    log);
