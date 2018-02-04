// re: 'ab|cd*', input: 'aacacd'
// re: '(aba*)*m', input: 'ababam'
const find = exports.find = function(input, re) {
    let reState = parse(re)
    let textLength = input.length

    let result = {begin: 0, length: 0, matched: false}
    let beginIndex = 0
    for(;;) {
        let length = 0
        if(beginIndex >= textLength)
            return result
        
        beginIndex ++
        let currentState = reState
        let matched = 0
        while(matched = currentState.match(input, length)) {
            length += matched
            currentState = currentState.nextState
            if(currentState === Matched) {
                result.begin = beginIndex
                result.length = length
                result.matched = true
                return result
            }
        }

        input = input.substr(beginIndex, input.length)
    }

}

class State {
    
    constructor(type, value, nextState) {
        this.type = type;
        this.value = value;
        this.nextState = nextState;
    }

    match(input, begin) {
        if(this.type === 'Letter') {
            return (this.value === input[begin]) * 1
        }
        if(this.type === 'Or') {
            return (this.value[0] === input[begin] || this.value[1] === input[begin]) * 1
        }
        if(this.type === 'Some') {
            let loop = 0;
            if(!input)
                return 0
            while(input[begin + loop] === this.value) {
                loop ++
            }
            return loop
        }
    }
}


const MATCHEDTYPE = 1;
const Matched = new State(MATCHEDTYPE, null, null);

const isLetter = function(num) {
    return (num >= 65 && num <= 90) || (num >=97 && num <=122);
}

const parse = function(inputRE) {
    if(!inputRE)
        return Matched

    let thisChar = inputRE.charCodeAt(0)
    if(thisChar === 40) { // (
        let nextInput = inputRE.substr(1, inputRE.length)
        return new State('Nested', parse(nextInput), parse(nextInput))
    }

    let nextChar = inputRE.charCodeAt(1)
    if(nextChar === 41) { // )
        let letter = inputRE[0]
        let nextInput = inputRE.substr(2, inputRE.length)
        return new State('Letter', letter, Matched)
    }
    if(!isLetter(thisChar))
        throw new Error('except a letter but not')

    if(isLetter(nextChar)) {
        let letter = inputRE[0]
        let nextInput = inputRE.substr(1, inputRE.length)
        return new State('Letter', letter, parse(nextInput))
    }
    if(nextChar === 124) {// |
        let left = inputRE[0]
        let right = inputRE[2]
        let nextInput = inputRE.substr(3, inputRE.length)
        return new State('Or', [left, right], parse(nextInput))
    }
    if(nextChar === 42) {// *
        let some = inputRE[0]
        let nextInput = inputRE.substr(2, inputRE.length)
        return new State('Some', inputRE[0], parse(nextInput))
    }
}
