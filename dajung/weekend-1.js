const { map, filter, reduce, go, pipe, curry } = require('./lib')

const students = [
    {name: '초롱이', 국어: 60, 수학: 63, 영어: 87},
    {name: '빡빡이', 국어: 40, 수학: 72, 영어: 82},
    {name: '마동석', 국어: 70, 수학: 38, 영어: 41},
    {name: '리키',   국어: 90, 수학: 96, 영어: 56},
    {name: '백바지', 국어: 85, 수학: 53, 영어: 78}
];

// - 과목별 평균을 내는 함수
// - 각 학생의 국,영,수 평균을 내는 함수
// - 영어 점수가 높은순대로 정렬해주는 함수

// 과목별 평균
// [ 40, 29, 49 ] 

// 한 학생의 국영수 평균
// [
//   { name: '초롱이', 평균: 32 }
//   { name: '빡빡이', 평균: 32 }
//   ....
// ]

// 
/*
[
    {name: '초롱이', 국어: 60, 수학: 63, 영어: 87},
    {name: '빡빡이', 국어: 40, 수학: 72, 영어: 82},
    {name: '백바지', 국어: 85, 수학: 53, 영어: 78},
    {name: '리키', 국어: 90, 수학: 96, 영어: 56},
    {name: '마동석', 국어: 70, 수학: 38 영어: 41},
];
*/
// 과목별 평균을 내는 함수
const add = (acc, scores) => {
	acc[0] += scores[0]
	acc[1] += scores[1]
	acc[2] += scores[2]
	
	return acc
}

console.log(go(
	students,
	map(s => Object.values(s)),
	map(s => s.slice(1)),
	reduce(add),
	map(s => s / students.length)
))


const average = pipe(
    (student) => {
        student.평균 = student.국어 + student.수학 + student.영어
        return student
    },
    (student) => {
        student.평균 /= 3
        return student;
    }
)


// 각 학생의 평균을 내는 함수
console.log(
    go(
        students,
        map((student) => {
            student.평균 = 0
            return student
        }),
        map(average),
        map((student) => {
            return {
                name: student.name,
                평균: student.평균
            }
        })
    )
)

// 영어 점수가 높은순대로 정렬해주는 함수
console.log(students.sort((a, b) => b.영어 - a.영어))
