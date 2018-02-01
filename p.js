// re: 'ab|cd*', input: 'aacacd'
const find = exports.find = function(input, re) {

}

const State = function(type, value, nextState) {
    this.type = type;
    this.value = value;
    this.nextState = nextState;
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
    let nextChar = inputRE.charCodeAt(1)
    if(!isLetter(thisChar))
        throw new Error('except a letter but not')

    if(isLetter(nextChar)) {
        return new State('Letter', inputRE[0], parse(inputRE.substr(1, inputRE.length)))
    }

    if(nextChar === 124) {// |
        return new State('Or', [inputRE[0], inputRE[2]], parse(inputRE.substr(3, inputRE.length)))
    }
    if(nextChar === 42) {// ×
        return new State('Some', inputRE[0], parse(inputRE.substr(2, inputRE.length)))
    }
}