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

const _break = {keyword: 'break'},
      _case = {keyword: 'case'},
      _catch = {keyword: 'catch'},
      _continue = {keyword: 'continue'},
      _default = {keyword: 'default'},
      _do = {keyword: 'do'},
      _else = {keyword: 'else'},
      _for = {keyword: 'for'},
      _function = {keyword: 'function'},
      _if = {keyword: 'if'},
      _return = {keyword: 'return'},
      _switch = {keyword: 'switch'},
      _throw = {keyword: 'throw'},
      _try = {keyword: 'try'},
      _var = {keyword: 'var'},
      _while = {keyword: 'while'},
      _new = {keyword: 'new'},
      _false = {keyword: 'false', value: false},
      _true = {keyword: 'true', value: true},
      _null = {keyword: 'null', value: null};

const KeyWords = {
    'break': _break,
    'case': _case,
    'catch': _catch,
    'continue': _continue,
    'default': _default,
    'do': _do,
    'else': _else,
    'for': _for,
    'function': _function,
    'if': _if,
    'return': _return,
    'switch': _switch,
    'throw': _throw,
    'try': _try,
    'var': _var,
    'while': _while,
    'new': _new,
    'false': _false,
    'true': _true,
    'null': _null
}
