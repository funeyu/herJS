var data = [
    {regUid: 1, regId: "99990003", regName: "美团", upRegId: "999999", regEntireId: "999999/99990003/"},
    {regEntireId: "999999/99990003/999900033/999900033a/", regId: "999900033a", regName: "SUNMI V1", regUid: 5, upRegId: "999900033"},
    {regEntireId:"999999/99990003/999900031/", regId:"999900031", regName:"美团酒店",regUid:2, upRegId: "99990003"},
    {regEntireId:"999999/99990003/999900032/", regId:"999900032", regName:"美团外卖", regUid:3, upRegId: "99990003"},
    {regEntireId: "999999/99990003/999900033/", regId: "999900033", regName: "Sunmi测试机构", regUid: 4, upRegId: "99990003"},
]

var treeData ={}

var findChild = function(children, key) {
    if(!children) return

    for(var i = 0; i < children.length; i ++) {
        if(children[i].key === key)
            return children[i]
    }
}

data.forEach(function(d) {
    var ids = d.regEntireId.substr(0, d.regEntireId.length - 1).split('\/')
    if(ids.length === 2) {
        treeData.label = d.regName;
        treeData.value = d;
        treeData.key = d.regId;
    } else {
        var current = treeData;

        for(var i = 2; i < ids.length; i ++) {
            if(i === (ids.length - 1)) {
                current.children = current.children || []
                var empty
                if(current.children.length > 0 && (empty = findChild(current.children, ids[i]))) {
                    empty.label = d.regName
                    empty.value = d
                    return
                }
                current.children.push({
                    label: d.regName,
                    value: d,
                    key: d.regId
                })
            } else if(!current.children) {
                current.children = []
                current.children.push({
                    key: ids[i]
                })
                current = current.children[0]
            } else {
                current = findChild(current.children, ids[i])
            }
        }
    }
})

console.log(JSON.stringify(treeData))