const mostCommonString = require('../utils/mostCommonString')

test('finds the most common string in an array', () => {
    expect(mostCommonString(['one', 'two', 'three', 'one', 'two', 'one'])).toBe('one')
})
test('first string is most common if no other string has more occurrences', () => {
    expect(mostCommonString(['test', 'demo', 'preview'])).toBe('test')
})