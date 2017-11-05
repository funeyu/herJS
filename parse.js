
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

Node.prototype.setParent = function(parent) {

    this.parent = parent;
}

Node.prototype.addLeft = function(left) {

    left.parent = this;
    this.left = left;
}

Node.prototype.addRight = function(right) {

    this.parent = this;
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
    var type = null;

    string = string.trim();
    for(var advance = 0; ;) {
        type += string[advance];
        if(string[advance + 1] == " ") {
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

var leftParentheses = /\(\s+/g;
var rightParentheses = /\s+\)/g;

var numberSymbols = /^\s+\d+/g

var parse = function (codeString, parent) {

    if(codeString.length <= 0) {
        return ;
    }

    leftParentheses.exec(codeString);
    if(leftParentheses.lastIndex > 0) {
        codeString = codeString.substr(leftParentheses.lastIndex, codeString.length);
        var info = findType(codeString);
        if(info.advance > 0) {
            codeString.substr(info.advance, codeString.length);
            var codeNode = new Node();
            codeNode.setParent(parent);
            codeNode.setType(info.type);
            if(info.type == "*") {
                if(numberSymbols.exec(codeString)) {
                    var parsedNumber = parseNumber(codeString.substr(numberSymbols.index, numberSymbols.lastIndex));
                    codeString = codeString.substr(numberSymbols.lastIndex, codeString.length);
                    codeNode.addLeft(new Node().setType("number").setValue(parsedNumber));

                    if(numberSymbols.exec(codeString)) {
                        var rightNumber = parseNumber(codeString.substr(numberSymbols.index, numberSymbols.lastIndex));
                        codeNode.addRight(new Node().setType("number").setValue(rightNumber));
                        codeString = codeString.substr(numberSymbols.lastIndex, codeString.length);

                        if(rightParentheses.exec(codeString)) {
                            codeNode.rightParentheses = true;
                            codeString = codeString.substr(rightParentheses.lastIndex, codeString.length);
                        }

                    } else {

                    }
                } else {
                    throw new Error("语法错误");
                }

            }
        }

        throw new Error("语法错误!!");
    }

}