const getLineInfo = require('./h').getLineInfo

console.log(
    getLineInfo("java" + "\n" +
        "elcoooooo", 8)
)

const find = require('./p').find
let re = find('aacacdddd', 'ab|cd*')
console.log(re)

let nested = find('(abc)*abd', 'abd')
let nested1 = find('(abc)*abd', 'abcabcabd')