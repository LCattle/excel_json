var XL = require('xlsx');
var EJ = {
    _init: function(){
        var that = this;

    },
    getExcelData: function(fileUrl) {
        console.log(process.cwd())
        if(!fileUrl){
            console.log('请传入文件的绝对位置！')
            return;
        }
        var jsonData = null;
        var lists = XL.readFile(fileUrl);
        if (!lists) {
            console.log('===============>Excel为空！')
        } else {
            var data = lists.Sheets[lists.SheetNames[0]]
             jsonData =  XL.utils.sheet_to_json(data)
            console.log(lists.Sheets[lists.SheetNames[0]])
            console.log('----------------------------------------')
            console.log(jsonData)
        }

        return jsonData || null;
    }
}

if(typeof module !== undefined){
    module.exports = EJ;
}