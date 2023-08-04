const log = console.log;

//* async / await
function delay(time) {
  return new Promise((resolve) => setTimeout(() => resolve(), time));
}

async function delayIdentity(a) {
  await delay(1000);
  return a;
}

async function f1() {
  const a = await delayIdentity(10);
  const b = await delayIdentity(5);

  log(a + b);
  return a + b;
}

f1().then(log);

(async () => {
  log(await f1());
})();
