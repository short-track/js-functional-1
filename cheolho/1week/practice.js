const log = console.log;
const curry = f =>
    (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);
const map = curry((f, iter) => {
  let res = [];
  for (const a of iter) {
    res.push(f(a));
  }
  return res;
});
const filter = curry((f, iter) => {
  let res = [];
  for (const a of iter) {
    if (f(a)) res.push(a);
  }
  return res;
});
const reduce = curry((f, acc, iter) => {
  // log(reduce(add, [1, 2, 3, 4, 5])); -> log(reduce(add, 1, [1, 2, 3, 4, 5]));
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
});
const go = (...args) => reduce((a, f) => f(a), args);
const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);

const students = [
  {name: '초롱이', 국어: 60, 수학: 63, 영어: 87},
  {name: '초루기', 국어: 85, 수학: 53, 영어: 34},
  {name: '빡빡이', 국어: 40, 수학: 72, 영어: 82},
  {name: '마동석', 국어: 70, 수학: 38, 영어: 41},
  {name: '리키', 국어: 90, 수학: 96, 영어: 56},
  {name: '백바지', 국어: 85, 수학: 53, 영어: 78},
  {name: '뭐니', 국어: 85, 수학: 53, 영어: 12}
];

const subjects = ['국어', '수학', '영어'];
const add = (a, b) => a + b;

const sum = curry((f, iter) => go(
  iter,
  map(f),
  reduce(add)));

// 파이프를 적용해 이터레이터를 나중에 받을 수 있도록 한다.
// sum에는 커링이 적용돼있으므로 pipe에 이터레이터가 전달되는 순간 go(iter, sum(f))가 되어 sum(f)에 이터레이터가 전달되면서 실행된다.
// go(scores, scores => avg(s => s.kor, scores.length)(scores))를 go(scores, avg(s => s.kor, scores.length)) 로 표현할 수 있다.
const avg = (f, length) => pipe(
  sum(f),
  num => Math.floor(num / length),
);

// scores => avg(s => s.kor, scores.length)


// 커리로도 비슷하게 가능
// const curriedAvg = curry((f, length) => iter => go(
//   iter,
//   sum(f),
//   num => Math.floor(num / length),
// ));

// const avgByKor = curriedAvg(s => s.kor);
// go(scores,
//   avgByKor(scores.length),
//   log);


// go(scores,
//   curriedAvg(s => s.kor, scores.length),
//   log);


log("과목별 평균");
const avgBySubject = subject => go(
  students,
  avg(student => student[subject], students.length),
);

go(
  subjects,
  map(avgBySubject),
  log
);

log();
log("각 학생의 국영수 평균");
const avgByStudent = student => go(
  subjects,
  avg(subject => student[subject], subjects.length)
);

go(
  students,
  map(student => ({
    name: student.name,
    '평균': avgByStudent(student)
  })),
  log
);

log("");
log("영어 점수가 높은순대로 정렬해주는 함수");
const sortFromLibrary = (comparator, array) => {
  if (array.length <= 1) return array;
  var pivot = array.shift();
  const [left, right] = array.reduce((acc, cur) => {
    comparator(pivot, cur) >= 0 ? acc[0].push(cur) : acc[1].push(cur);
    return acc;
  }, [[], []]);

  const lSorted = sortFromLibrary(comparator, left);
  const rSorted = sortFromLibrary(comparator, right);

  return [...lSorted, pivot, ...rSorted];
};


const sort = (comparator) => arr => sortFromLibrary(comparator, arr.slice());
go(
  students,
  sort((a, b) => b['영어'] - a['영어']),
  log);
// log(students);