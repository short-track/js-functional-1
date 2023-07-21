import { map, reduce, go, pipe, curry, filter } from './../common.js'

const log = console.log

const products = [
    { name: '반팔티', price: 15000, quantity: 1 },
    { name: '긴팔티', price: 20000, quantity: 2 },
    { name: '핸드폰케이스', price: 15000, quantity: 3 },
    { name: '후드티', price: 30000, quantity: 4 },
    { name: '바지', price: 25000, quantity: 5 }
];

// 총 수량
// const tatal = products => go(products,
//     map(p => p.quantity),
//     reduce((a, b) => a + b),
//     log);

// const get_tatal = pipe(
//     map(p => p.quantity),
//     reduce((a, b) => a + b));

// log(get_tatal(products));

// const get_price = pipe(
//     map(p => p.price * p.quantity),
//     reduce((a, b) => a + b));

// log(get_price(products));

log("=====================================")

// 추상화 레벨이 더 높음
const sum = curry((fn, iter) => go(
    iter,
    map(fn),
    reduce((a, b) => a + b)));

const get_total_quantity = sum(p => p.quantity);
const get_total_price = sum(p => p.price * p.quantity,);

document.querySelector('#cart').innerHTML = `
    <table>
      <tr>
        <th></th>
        <th>상품 이름</th>
        <th>가격</th>
        <th>수량</th>
        <th>총 가격</th>
      </tr>
      ${go(products, sum(p => `
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
        <td>${get_total_quantity(filter(p => p.is_selected, products))}</td>
        <td>${get_total_price(filter(p => p.is_selected, products))}</td>
      </tr>
    </table>
  `;