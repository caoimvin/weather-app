/**
 * Find the most common string inside an array
 * @param {Array} array 
 * @returns {String}
 */
function mostCommonString(array) {
    if (array.length == 0) return null
    const stringMap = {}
    let maxElement = array[0], maxCount = 1;
    for (const string of array) {
        if (stringMap[string] == null) stringMap[string] = 1
        else stringMap[string]++

        if (stringMap[string] > maxCount) {
            maxElement = string
            maxCount = stringMap[string]
        }
    }
    return maxElement
}

module.exports = mostCommonString