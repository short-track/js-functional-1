// async/await
// 기억해둬야할 것은 async가 붙은 메서드는 항상 Promise를 반환한다
const delay = (time) => new Promise(resolve => {
    setTimeout(() => resolve(), time);
})

async function delayIdentity(a) {
    await delay(500)
    return a
}

async function f1() {
    const a = await delayIdentity(10)
    const b = await delayIdentity(5)
    // console.log(a)
    return a + b
}

// f1().then(console.log)
// go(f1(), console.log)
// (async () => {
//     console.log(await f1())
// })();

const pa = Promise.resolve(10)

(async () => {
    console.log(pa)
}) ();

console.log(f1()) // Promise { <pending> }

