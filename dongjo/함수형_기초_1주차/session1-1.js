
const rules = {
    "출석": "참석하기",
    "학습": "결과물 제출하기",
    [Symbol.iterator]() {
        const keys = Object.keys(this);
        let size = keys.length - 1;
        return {
            next() {
            return size < 0 ? {done: true} : {value: keys[size--], done: false};
            },
            [Symbol.iterator]() {
            return this;
            }
        }
    }
};

// TypeError: rules is not iterable
// const rules = {
//     "출석": "참석하기",
//     "학습": "결과물 제출하기",
// };


for (const obj of rules) {
    console.log(obj);
}