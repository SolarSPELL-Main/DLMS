/*
 *  This builds a map from an array of objects.
 */
const buildMapFromArray = (array, key) => {
    const retval = {};
    array.map(currObj => {
            retval[currObj[key]] = currObj;
    });
    return retval;
}

export {
    buildMapFromArray
}