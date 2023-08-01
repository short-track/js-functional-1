import { log, go, pipe, curry } from './common.js'

// function* Cut(num, callback) {
// 	let i = 0;
// 	while(true) {
// 		yield i++;
// 		if (i === num - 1) {
// 			return callback()
// 		}
// 	}
// }

// var cut = Cut(3, function() {
//   console.log("3 timelines are finished");
// });
  
// cut.next();
// cut.next();


// 발제문 1



// 발제문 2
const L = {};
// Object.entries를 활용 [[key, value], [key, value], [key, value]] 형태로 만들어준다.
L.entries = function* (obj) {
    for (const k in obj) yield [k, obj[k]];
};
const isObject = (obj) => typeof obj === 'object' && !Array.isArray(obj) && obj !== null;
L.deepFlat = function* f(iter) {
    for (const [k, v] of iter) {
        if (isObject(v)) yield* f(L.entries(v));
        else yield [k, v];
    }
};
L.map = curry(function* (f, iter) {
    for (const a of iter) {
        yield f(a);
    }
});
const take = curry((l, iter) => {
    let res = [];
    for (const a of iter) {
        res.push(a);
        if (res.length == l) return res;
    }
    return res;
});
const takeAll = take(Infinity);
const makeObj = curry((obj = {}, iter) => {
	for (const [k, v] of iter) {
		obj[k] = v
	}
	return obj
});


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
	L.entries,
	L.deepFlat,
	takeAll,
	makeObj({}),
	log,
)



// 발제문 3
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
const isIterable = a => a && a[Symbol.iterator];
L.filter = curry(function* (f, iter) {
    for (const a of iter) {
        if (f(a)) yield a;
    }
});
L.flatten = function* (iter) {
    for (const a of iter) {
        if (isIterable(a)) for (const b of a) yield b
        else yield a;
    }
};
L.flatMap = curry(pipe(L.map, L.flatten));

const sort = (iter) => {
	const arr = [...iter]
	return arr.sort((a, b) => b - a)
}

go(users,
    L.flatMap(u => [{name: u.name, age: u.age}, ...u.family]),
    L.filter(u => u.age < 25),
    L.map(u => u.age),
	sort,
    take(3),
    log);
