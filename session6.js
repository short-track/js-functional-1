// range와 L.range
// range
const range = l => {
  let i = -1;
  let res = [];
  while (++i < l) {
    res.push(i);
  }
  return res;
};

var list = range(4);
console.log(list); // [0, 1, 2, 3]
console.log(reduce(add, list));


// generator를 활용해서 지연평가되는 range 함수 구현
// L.range
const L = {};

L.range = function* (l) {
  let i = -1;
  while (++i < l) {
    yield i;
  }
};

// reduce에 들어섰을때 비로소 값으로 평가된다.
var list = L.range(4);
console.log(list);
console.log(reduce(add, list));

// range와 L.range 속도 비교
function test(name, time, f) {
  console.time(name);
  while (time--) f();
  console.timeEnd(name);
}

// test('range', 10, () => reduce(add, range(1000000)));
// test('L.range', 10, () => reduce(add, L.range(1000000)));
console.clear();
