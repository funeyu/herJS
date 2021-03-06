
var Node = function() {

    this.type = null;
    this.parent = null;
    this.left = null;
    this.right = null;

    // 标识Node是否闭合了
    this.rightParentheses = false;
    this.value = null;
}

Node.prototype.setType = function(type) {

    this.type = type;
    return this;
}

Node.prototype.isLeftEmpty = function() {

    return !this.left
}

Node.prototype.setParent = function(parent) {

    if(!parent) return;

    if(!parent.left) {
        parent.left = this;
    } else {
        parent.right = this;
    }
    this.parent = parent;
}

Node.prototype.addLeft = function(left) {

    left.parent = this;
    this.left = left;
}

Node.prototype.addRight = function(right) {

    right.parent = this;
    this.right = right;
}

Node.prototype.setValue = function(value) {

    this.value = value;
    return this;
}

Node.prototype.apply = function() {

    if(type === '*') {
        this.value = this.left * this.value;
    }
}

Node.prototype.getParent = function () {

    return this.parent;
}

function findType(string) {
    var type = "";

    string = string.trim();
    for(var advance = 0; ;) {
        type += string[advance];
        if(string[++advance] == " ") {
            return {
                type: type,
                advance: advance
            }
        }
    }

    return {
        type: null,
        advance: 0
    }
}

var parseNumber = function(string) {

    return string.trim() - "0"
}

var leftParentheses = /^\s*\(\s+/g;
var rightParentheses = /^\s*\)/g;

var firstRightParentheses = /\)/g;

var numberSymbols = /^\s*\d+/g

var tokenReg = /^\s*\w\s+/g

var parseArguments = function(codeString) {

    return codeString.split(/\s+/g).filter(function(one) {
        return one;
    })

}

// 没有标识结束
var expression = function(codeString, node) {

    console.log('expression', codeString)
    if(codeString.length < 1) return '';

    leftParentheses.lastIndex = 0;
    leftParentheses.exec(codeString);

    if(leftParentheses.lastIndex < 1) {
        rightParentheses.lastIndex = 0;

        rightParentheses.exec(codeString);

        if(rightParentheses.lastIndex > 0) {
            node.rightParentheses = true;
            console.log(true)
            return expression(codeString.substr(rightParentheses.lastIndex, codeString.length), node.getParent())
        } else { //结束
            return ;
        }
    };


    codeString = codeString.substr(leftParentheses.lastIndex, codeString.length);

    var info = findType(codeString);

    codeString = codeString.substr(info.advance, codeString.length);

    if(info.advance > 0) {
        switch (info.type) {
            case '+' :
                var nNode = new Node();
                nNode.setType("+");
                nNode.setParent(node);
                tokenReg.lastIndex = 0;
                tokenReg.exec(codeString)
                leftParentheses.lastIndex = 0

                if(tokenReg.lastIndex > 0) {
                    var symbol = codeString.substr(tokenReg.index, tokenReg.lastIndex);
                    codeString = codeString.substr(tokenReg.lastIndex, codeString.length);
                    nNode.addLeft(new Node().setType('symbol').setValue(symbol));

                    tokenReg.lastIndex = 0
                    if(tokenReg.exec(codeString)) {
                        var sym = codeString.substr(tokenReg.index, tokenReg.lastIndex);
                        codeString = codeString.substr(tokenReg.lastIndex, codeString.length)
                        nNode.addRight(new Node().setType('symbol').setValue(sym));
                    }

                    return expression(codeString, nNode);
                } else if(leftParentheses.exec(codeString)) {
                    return expression(codeString, nNode);
                } else {
                    throw new Error('语法错误!')
                }
                break;
        }
    }

}

var parseDefination = function(codeString, codeNode) {

    var advance = 0;

    leftParentheses.lastIndex = 0;

    leftParentheses.exec(codeString);
    advance = leftParentheses.lastIndex;

    codeString = codeString.substr(leftParentheses.lastIndex, codeString.length);

    var info = findType(codeString);
    advance += info.advance;

    codeNode.callName = info.type;
    codeString = codeString.substr(info.advance, codeString.length);

    firstRightParentheses.lastIndex = 0;
    firstRightParentheses.exec(codeString);

    advance += firstRightParentheses.lastIndex;

    var argString = codeString.substr(firstRightParentheses.index, firstRightParentheses.lastIndex - 1);

    var args = parseArguments(argString);

    codeNode.arguments = args;

    return advance;
}

var parse = function (codeString, parent) {

    if(codeString.length <= 0) {
        return ;
    }
    if(rightParentheses.exec(codeString)) {

        codeString = codeString.substr(rightParentheses.lastIndex, codeString.length);

        rightParentheses.lastIndex = 0;
        return parse(codeString, parent.getParent());
    }
    leftParentheses.exec(codeString);

    if(leftParentheses.lastIndex > 0) {
        codeString = codeString.substr(leftParentheses.lastIndex, codeString.length);

        leftParentheses.lastIndex = 0;
        var info = findType(codeString);
        if(info.advance > 0) {
            codeString = codeString.substr(info.advance, codeString.length);
            var codeNode = new Node();
            codeNode.setParent(parent);
            codeNode.setType(info.type);
            if(info.type == "*") {
                if(numberSymbols.exec(codeString)) {
                    var parsedNumber = parseNumber(codeString.substr(numberSymbols.index, numberSymbols.lastIndex));

                    codeString = codeString.substr(numberSymbols.lastIndex, codeString.length);
                    codeNode.addLeft(new Node().setType("number").setValue(parsedNumber));

                    numberSymbols.lastIndex = 0;
                    if(numberSymbols.exec(codeString)) {
                        var rightNumber = parseNumber(codeString.substr(numberSymbols.index, numberSymbols.lastIndex));
                        codeNode.addRight(new Node().setType("number").setValue(rightNumber));
                        codeString = codeString.substr(numberSymbols.lastIndex, codeString.length);

                        numberSymbols.lastIndex = 0;
                        if(rightParentheses.exec(codeString)) {
                            codeNode.rightParentheses = true;
                            codeString = codeString.substr(rightParentheses.lastIndex, codeString.length);

                            rightParentheses.lastIndex = 0;
                            return parse(codeString, codeNode);
                        }

                    } else {

                        leftParentheses.lastIndex = 0;
                        leftParentheses.exec(codeString);

                        if(leftParentheses.lastIndex > 0) {
                            leftParentheses.lastIndex = 0;

                            return parse(codeString.trim(), codeNode);
                        } else {
                            throw new Error("语法错误");
                        }
                    }
                } else {
                    throw new Error("语法错误");
                }

            }

            else if(info.type == 'define') {
                codeString = codeString.substr(leftParentheses.lastIndex, codeString.length);

                var advance = parseDefination(codeString, codeNode);
                codeString = codeString.substr(advance, codeString.length);
                console.log(codeString)

                expression(codeString, codeNode)
                console.log(codeNode);

            }
        }

    }

}

var root = new Node();
var ss = "( * 4 ( * 2 3 ) )"
var fn = "( define ( double x ) ( + x ( + x x ) ) )"
var ff = "( define ( double x ) ( + ( + x x ) ( + x x ) ) )"
var whiles = ""
parse(fn, root)