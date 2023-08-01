const { go, L, take, flatten, takeAll } = require('../lib')

// 2차원 배열 다루기
const arr = [
  [1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [9, 10]
]

go(arr,
    L.flatten,
    L.filter(a => a % 2),
    L.map(a => a * a),
    take(4),
    console.log)

// 실무적인 코드
const users = [
    {
      name: 'a', age: 21, family: [
        {name: 'a1', age: 53}, {name: 'a2', age: 47},
        {name: 'a3', age: 16}, {name: 'a4', age: 15}
      ]
    },
    {
      name: 'b', age: 24, family: [
        {name: 'b1', age: 58}, {name: 'b2', age: 51},
        {name: 'b3', age: 19}, {name: 'b4', age: 22}
      ]
    },
    {
      name: 'c', age: 31, family: [
        {name: 'c1', age: 64}, {name: 'c2', age: 62}
      ]
    },
    {
      name: 'd', age: 20, family: [
        {name: 'd1', age: 42}, {name: 'd2', age: 42},
        {name: 'd3', age: 11}, {name: 'd4', age: 7}
      ]
    }
  ];

go(
    users,
    L.map(u => u.family),
    L.flatten,
    // L.filter(u => u.age < 20),
    // L.map(u => u.name),
    take(4),
    console.log
)

// 객체 지향 프로그래밍과 함수형 프로그래밍에 대해서 비교를 하는 내용이 나온다.
// 객체 지향 프로그래밍에 대해서 데이터를 먼저 정의한다고 하는데
// 오브젝트라는 책에서는 다른 관점의 객체지향을 설명한다
// 클래스, 데이터를 먼저 설계하지 않고 기능을 먼저 생각하고 여기에 맞춰서 설계한다는 내용이다.
