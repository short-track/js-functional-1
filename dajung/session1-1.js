// iterable/iterator 프로토콜을 사용하는 데이터 구조는
// index로 접근할 수 없음

const set = new Set([1, 2, 3])
console.log(set[0]) // undefined

const  map = new Map([['a', 1], ['b', 2], ['c', 3]])
console.log(map[0]) // undefined

// 그렇다면 array는 for of를 사용할 수 있는데 어떻게 index로도 접근이 가능한가?
// 결론부터 말하면 index가 key로 들어가서 접근이 가능하다
const arr = [1, 2, 3, 4]
console.log(Object.keys(arr)) // [ '0', '1', '2', '3' ]

// iterable 프로토콜을 사용하는 자료는 내부적으로 Symbol.iterator가 있는데 iterator를 반환하는 메서드다
const arrayIterator = arr[Symbol.iterator]() 
console.log(arrayIterator) // Object [Array Iterator] {}

// iterator는 다음 값을 반환하는 next라는 메서드를 갖고있다.
console.log('next' in arrayIterator) // true
console.log(typeof arrayIterator.next === 'function') // true
// next는 { value, done } 을 반환한다
console.log(arrayIterator.next()) // { value: 1, done: false }

// iterable/iterator 프로토콜을 사용하는 for .. of
// 위에서 next메서드를 실행하다 보면 반환 객체에 done이 true로 떨어지는데 끝이라는 이야기
console.log(arrayIterator.next()) // { value: 2, done: false }
console.log(arrayIterator.next()) // { value: 3, done: false }
console.log(arrayIterator.next()) // { value: 4, done: false }
console.log(arrayIterator.next()) // { value: undefined, done: true }

// 따라서 for (const a of arr) { ... } 가 있을 때
// a에 value 가 들어가고 done이 true 일때 for 문을 빠져나오는 것을 짐작할 수 있다

// map 자료형의 메서드인 keys, values, entries는 iterable 프로토콜을 따른다.
// 따라서 iterator를 반환한다
console.log(map.keys()) // [Map Iterator] { 'a', 'b', 'c' }
console.log(map.values()) // [Map Iterator] { 1, 2, 3 }

// 다만 entries는 Entries을 반환한다
console.log(map.entries()) // [Map Entries] { [ 'a', 1 ], [ 'b', 2 ], [ 'c', 3 ] }

let mapElement;
// entries의 원소들은 배열이기 때문에 iterable 프로토콜을 따른다
for (const element of map.entries()) {
    mapElement = element[Symbol.iterator]()
    console.log(mapElement) // Object [Array Iterator] {}
}

// 그렇다면 entries의 원소들은 역시 next를 갖고 키와 value를 반환한다
console.log(mapElement.next()) // { value: 'c', done: false }
console.log(mapElement.next()) // { value: 3, done: false }
console.log(mapElement.next()) // { value: undefined, done: true }
