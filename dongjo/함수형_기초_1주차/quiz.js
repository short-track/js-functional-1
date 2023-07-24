import {go, map, reduce} from './common.js';
// // 1 발제문
// // go 함수는 인자를 초기값과, 함수들을 받아서, 초기값을 각각 함수에서 평가한 후 결과를 리턴한다
// // 내부적으로 reduce 함수를 사용한다
// const go = (init, ...fns) => {
//     return reduce((acc, fn) => fn(acc), [init, ...fns]);
// }

// // 내부적으로 인자가 함수와, reduce를 사용하기 때문에,
// // 실제로 돌아가는 reduce 코드를 보면, 아래와 같다
// // go() 함수에서 넘겨받은 함수들을 순회하면서, 차례대로 처리가 되고 그 처리된 결과값은 acc로 넘겨진다
// const reduce = (f, iter) => {
//     let acc = iter.next().value;

//     for (const a of iter) {
//         acc = f(acc, a);
//     }
//     return acc;
// };

// // [정리 2]
// // pipe 함수는 인자를 함수들을 받아서, 데이터를 각각의 함수에서 평가하는 함수를 리턴한다
// // 내부적으로 go 함수를 사용한다
// // 받은 함수는 최초 함수와, 나머지 함수들이다
// // 특히 최초함수는 pipe()의 결과 함수인 f가 받은 datas 를 인자로 받는다.
// // 그리고 그 결과값을 내부적으로 사용되는 reduce의 초기값으로 넣고, 나머지 함수들을 reduce의 iter로 넘긴다
// const pipe = (f, ...fns) => {
//     return (...args) => {
//         const init = f(...args);
//         return go(init, ...fns)
//     }
// }
// const f = pipe(
//     ...생략...
// )
// f(datas)
// // 내부적으로 go 함수가 사용되기 때문에,
// // 실제로 돌아가는 go의 동작은 위에서 설명한 것과 동일하다
// const go = (init, ...fns) => {
//     return reduce((acc, fn) => fn(acc), [init, ...fns]);
// }


// 2 발제문
const students = [
    {name: '초롱이', 국어: 60, 수학: 63, 영어: 87},
    {name: '빡빡이', 국어: 40, 수학: 72, 영어: 82},
    {name: '마동석', 국어: 70, 수학: 38, 영어: 41},
    {name: '리키', 국어: 90, 수학: 96, 영어: 56},
    {name: '백바지', 국어: 85, 수학: 53, 영어: 78}
];

//- 과목별 평균을 내는 함수
const avg = (iter) => {
    let sum = 0;
    for (const score of iter) {
        sum += score;
    }
    return sum / iter.length;
}

const totalAvg = (f) => go(
    students,
    map(f),
    avg,
)

const avg국어 = totalAvg(student => student.국어);
const avg영어 = totalAvg(student => student.영어);
const avg수학 = totalAvg(student => student.영어);

console.log([ avg국어, avg영어, avg수학 ])


//- 각 학생의 국,영,수 평균을 내는 함수

const scores = (f) => go(
    students,
    map(student => ({ name: student.name, 평균: f(student.국어 + student.영어 + student.수학)})),
)

const 평균s = scores((sum) => sum/3);
console.log(평균s);


// const sort = () => {
// // 생략
// }

// //- 영어 점수가 높은순대로 정렬해주는 함수
// const sortByEn = (f) => go(
//     students,
//     map(f),
//     sort,
// )



const getAvg = (f, iter) => go(
    iter,
    map(f),
    reduce((a, b) => a + b),
    (sum) => sum / iter.length,
)

console.log(getAvg(student => student.국어));