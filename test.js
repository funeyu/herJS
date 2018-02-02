const getLineInfo = require('./h').getLineInfo

console.log(
    getLineInfo("java" + "\n" +
        "elcoooooo", 8)
)

const find = require('./p').find
let re = find('aacacd', 'ab|cd*')
console.log(re)