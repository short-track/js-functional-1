// ## QnA. 이제 비동기는 async/await로 제어할 수 있는데 왜 파이프라인이 필요한지?
  function f5(list) {
    return go(list,
      L.map(a => delayI(a * a)),
      L.filter(a => delayI(a % 2)),
      L.map(a => delayI(a + 1)),
      C.take(2),
      reduce((a, b) => delayI(a + b)));
  }

  go(f5([1, 2, 3, 4, 5, 6, 7, 8]), a => log(a, 'f5'));

  async function f6(list) {
    let temp = [];
    for (const a of list) {
      const b = await delayI(a * a);
      if (await delayI(b % 2)) {
        const c = await delayI(b + 1);
        temp.push(c);
        if (temp.length == 2) break;
      }
    }
    let res = temp[0], i = 0;
    while (++i < temp.length) {
      res = await delayI(res + temp[i]);
    }
    return res;
  }

  go(f6([1, 2, 3, 4, 5, 6, 7, 8]), log);

// ## QnA. async/await와 파이프라인을 같이 사용하기도 하나요?

  async function f52(list) {
    const r1 = await go(list,
      L.map(a => delayI(a * a)),
      L.filter(a => delayI(a % 2)),
      L.map(a => delayI(a + 1)),
      C.take(2),
      reduce((a, b) => delayI(a + b)));

    const r2 = await go(list,
      L.map(a => delayI(a * a)),
      L.filter(a => delayI(a % 2)),
      reduce((a, b) => delayI(a + b)));

    const r3 = await delayI(r1 + r2);

    return r3 + 10;
  }

  go(f52([1, 2, 3, 4, 5, 6, 7, 8]), a => log(a, 'f52'));