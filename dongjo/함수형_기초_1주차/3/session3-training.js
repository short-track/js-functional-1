const log = console.log

const genObj = (obj) => {
    return {
        ...obj,
        [Symbol.iterator]() {
            const keys = Object.keys(this);
            const values = Object.values(this);
            let size = keys.length - 1;
            return {
                next() {
                    if (size < 0) {
                        return {done: true};
                    }
                    const idx = size;
                    const res = {value: { [keys[idx]]: values[idx] }, done: false};
                    size--;
                    return res;
                },
                [Symbol.iterator]() {
                    return this;
                }
            }
        }
    };
}
// # map
const map = (f, iter) => {
    let res = [];
    for (const a of iter) {
        res.push(f(a));
    }
    return res;
};

log(map(obj => obj, genObj({
    "출석": "참석하기",
    "학습": "결과물 제출하기",
})));
