const deepCopy = (obj) => {
    if (!obj) {
        return null;
    }
    if (typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            newObj[key] = deepCopy(obj[key]);
        }
        return newObj;
    }
    if (Array.isArray(obj)) {
        return obj.map(deepCopy);
    }
    return obj;
}