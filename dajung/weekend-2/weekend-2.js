const { go, L, flatMap, take, flatten, map, filter, reduce } = require('../lib')

// a 와 b 코드의 차이점에 대해서 말해주세요.
// a.
// [[1, 2], [3, 4], [5, 6, 7]].flatMap(a => a.map(a => a * a))

// // b.
// L.flatMap(map(a => a * a), [[1, 2], [3, 4], [5, 6, 7]])

// a는 즉시 평가라서 모든 데이터를 먼저 준비하고 시작한다.
// 예를 들어 [[1, 2], [3, 4], [5, 6, 7]]라는 데이터로 즉시 평가를 한다면
// 현재 처리하는 데이터가 [1, 2]이 아니어도 [3, 4], [5, 6, 7]까지 모든 데이터를 준비한다.
// 이와 대조적으로 b인 지연 평가는 현재 처리하는 데이터만 준비를 한다.
// 즉 모든 데이터를 준비하지 않고 현재 사용하는 [1, 2]만 준비해서 계산하고 다음 데이터를 준비한다


const company = {
    회사명: '스터디캠프',
    설립일: '2023-05-05',
    기업구성원: {
      인원수: 4,
      명단: [
        '코치',
        '초롱이',
        '마동석',
        '빡빡이',
      ]
    },
    분야: '통신업',
}

go(
    company,
    Object.entries,
    reduce((a, b) => {
        if (Array.isArray(a)) {
            return {
                [a[0]] : a[1]
            }
        }
        if (b[0] === '기업구성원') {
            return {...a, ...Object.entries(b)[1][1]}
        }
        return {
            ...a,
            [b[0]] : b[1]
        }
        
    }),
    console.log
)

var users = [
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
    L.flatMap(x => [{name: x.name, age: x.age}, ...x.family]),
    filter(x => x.age <= 25),
    (x => x.sort((a, b) => b.age - a.age)),
    L.map(x => x.age),
    take(3),
    console.log
)


// 질문 지식 공유
// 벡엔드가 아니더라도, DB 선택에 있어서 다른 생각이 있다고 하신다면 말씀해주세요. 그 어떤 생각이라도 상관없습니다.

// 말씀하신것처럼 어떤 특성을 가진 서비스냐에 따라 많은 선택 요소가 있습니다. 
// 저는 **데이터 가공에 관점에서 생각을 해보면 nosql과 함수형 조합으로 백엔드를 구성하는 것은 좋은 생각으로 보입니다**. 
// nosql은 스키마를 유연하게 가져갈 수 있는 특징이 있습니다. mongo를 예로 들면 Json 타입이기만 하면 어떤 형태로든 저장이 가능합니다. 
// json이 깊어지거나 다양해질 수 있는 상황에서 위에서 학습한 함수형 기법으로 다양한 데이터 처리가 가능할 것으로 보입니다.
