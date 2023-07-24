// 장바구니의 총수량, 총가격 예제
// 이번 챕터에서 사용할 데이터
const products = [
  { name: '반팔티', price: 15000, quantity: 1 },
  { name: '긴팔티', price: 20000, quantity: 2 },
  { name: '핸드폰케이스', price: 15000, quantity: 3},
  { name: '후드티', price: 30000, quantity: 4},
  { name: '바지', price: 25000, quantity: 5},
];


// 1. 상품의 총 수량
go(products,
   map(a => a.quantity),
   reduce((a, b) => a + b),
   console.log
); // 15


// 2. product를 입력받는 함수로도 만들 수 있다.
const total_quantity = products => go(products,
    map(p => p.quantity),
    reduce((a, b) => a + b));

// 3.1 go 함수를 pipe로 변경한다면 더 깔끔하게 작성할 수 있다.
const total_quantity = pipe(
    map(p => p.quantity),
    reduce((a, b) => a + b));

// 3.2 상품의 총액을 구하는 함수도 쉽게 만들 수 있다.
const total_price = pipe(
    map(p => p.price * p.quantity),
    reduce((a, b) => a + b));

// 3.3 reduce의 콜백함수를 따로 분리하여 작성한 경우.
const add = (a, b) => a + b;

const total_quantity = pipe(
    map(p => p.quantity),
    reduce(add));

const total_price = pipe(
    map(p => p.price * p.quantity),
    reduce(add));



// 4.1 그러나 total_quantity 함수와 total_price 함수는 products 라는 장바구니 도메인에 국한된 함수이다.
//     -> quantity와 price 프로퍼티가 있는 리터럴 객체라는 도메인!
// 좀 더 추상화 레벨을 높여서 범용성 있는 함수를 만들어보자.
const sum = (f, iter) => go(
    iter,
    map(f),
    reduce(add));

console.log( sum(p => p.quantity, products) ); // 상품의 총 수량
console.log( sum(p => p.price * p.quantity, products) ); // 상품의 총액

// 4.2 만들어놓은 sum 함수를 사용해서 total_quantity 함수와 total_price 함수의 중복을 제거할 수 있다.
const total_quantity = products => sum(p => p.quantity, products);
const total_price = products => sum(p => p.price * p.quantity, products);


// 4.3 커링을 사용해서 더 간결하게 작성한 예시
//  step1: sum함수를 curry 함수로 감싸준다
const sum = curry((f, iter) => go(
    iter,
    map(f),
    reduce(add)));

//  step2: total_quantity 함수와 total_price 함수를 다음과 같이 변경할 수 있다.
const total_quantity = products => sum(p => p.quantity)(products);
const total_price = products => sum(p => p.price * p.quantity)(products);

//  step3: 이 문장은 다음과 같이 변경할 수도 있다.
const total_quantity = sum(p => p.quantity);
const total_price = sum(p => p.price * p.quantity);

// sum 함수는 추상화 레벨이 높은 함수이기 때문에 여러 함수를 만들 수 있다.
console.log(
 sum(u => u.age, [
  {age: 30},
  {age: 53},
  {age: 21}
 ])
); // 30 + 53 + 21

const total_age = sum(u => u.age);
console.log( total_age([{age: 10}, {age: 20}]) ); // 30



//  HTML로 출력하기
  const products2 = [
    {name: '반팔티', price: 15000, quantity: 1, is_selected: true},
    {name: '긴팔티', price: 20000, quantity: 2, is_selected: false},
    {name: '핸드폰케이스', price: 15000, quantity: 3, is_selected: true},
    {name: '후드티', price: 30000, quantity: 4, is_selected: false},
    {name: '바지', price: 25000, quantity: 5, is_selected: false}
  ];

// 위에서 만든 sum 함수는 map에 적용된 콜백 함수가 리턴하는 값들을 모두 더하기 때문에 이런 방식으로도 사용할 수 있다.
// total_quantity, total_price 사용하는 방식도 주목

document.querySelector('#cart').innerHTML = `
    <table>
        <tr>
            <th></th>
            <th>상품 이름</th>
            <th>가격</th>
            <th>수량</th>
            <th>총 가격</th>
        </tr>
        ${go(products2, sum(p => `
            <tr>
                <td><input type="checkbox" ${p.is_selected ? 'checked' : ''}></td>
                <td>${p.name}</td>
                <td>${p.price}</td>
                <td><input type="number" value="${p.quantity}"></td>
                <td>${p.price * p.quantity}</td>
            </tr>
        `))}
       <tr>
         <td colspan="3">합계</td>
         <td>${total_quantity(filter(p => p.is_selected, products))}</td>
         <td>${total_price(filter(p => p.is_selected, products))}</td>
       </tr>
   </table>
 `;
