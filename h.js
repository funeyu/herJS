const LineBreak = /\r\n?|[\n\r\u2028\u2029]/g;
const getLineInfo = exports.getLineInfo = function(input, offset) {
    let line = 0, walked = 0;
    while(walked < offset && LineBreak.exec(input)) {
        let index = LineBreak.lastIndex;
        line ++;
        walked += index;
        LineBreak.lastIndex = 0;
        input = input.substr(index, input.length)
    }
    return {
        line: line,
        column: offset - walked
    }
}

console.log(
    getLineInfo("java" + "\n" +
    "elcoooooo", 8)
)