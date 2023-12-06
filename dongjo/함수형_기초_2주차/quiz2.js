const data = {
	name: {
		value: 11,
		required: true,
	},
	age: {
		value: 20,
		required: false
	},
}


// function isValidAll(keys, form) {
// 	let result = [];
// 	for (const key of keys) {
// 		if(form[key].required) {
// 			if (!form[key].value) {
// 				// 실패
// 				return false;
// 			}
// 		}
// 	}
// 	return true;
// }
// const isValid = isValidAll(Object.keys(data), data);

function isValidAll2(form, filter, some) {
  const keys = Object.keys(form);
  return !keys.filter((key) => filter(form[key])).some((key) => some(form[key]));
} 

const isRequired = (data) => data.required
const isUndefined = (data) => data.value === undefined

const isValid2 = isValidAll2(data, isRequired, isUndefined);

console.log(isValid2)