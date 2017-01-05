var XL = require('xlsx');
var EJ = {
    _init: function(){

    },
    allDataTmp: function(){
        var allData = new Object();
        allData.provinceData = [];
        allData.cityData = [];
        allData.countyData = [];
        allData.templateData = [];
        return allData
    },
    getExcelData: function(fileUrl) {
        var self = this;
        if(!fileUrl){
            console.log('请传入文件的绝对位置！')
            return;
        }
        var allData = this.allDataTmp();
        var jsonData = null;
        var testString = '';
        var lists = XL.readFile(fileUrl);
        if (!lists) {
            console.log('===============>Excel为空！')
        } else {
            var tmpData = [];
            var data = lists.Sheets[lists.SheetNames[0]]
             jsonData =  XL.utils.sheet_to_json(data)
            var temItem = null; //暂存所有对象
            var itemOpts = {};//暂存所有对象的属性
            //存储数据
            for(var i = 0; i <= jsonData.length; i++){
                temItem = jsonData[i];
                if(!temItem){
                  break;
                }
                itemOpts = this.setItemOpts(temItem);
                tmpData.push(itemOpts)
            }

            //获到省份
            var proTem = null
            var proOpts = {}
            for(var j = 0; j <= tmpData.length; j++){
                proTem = tmpData[j];

                if(!proTem){
                    break;
                }
                proOpts = this.setItemOpts(proTem);
                //把json字符串转换成json对象
                var abb = '{"a":"bbb","b":{"z":"cc"}}';
                var b = JSON.parse(abb)
                if(/^([1-9][0-9])0000$/.test(proTem.region_code)){
                    //console.log('省份匹配上了。： ' + proOpts.region_code)
                    allData.provinceData.push(itemOpts);
                }else{
                   // console.log('省份匹配不上了！： ' + proOpts.region_code)
                    allData.templateData.push(itemOpts);
                }
            }

        }

        return testString || null;
    },
    setItemOpts: function(temItem){
        if(!temItem || temItem === ''){
            return '';
        }
        var itemOpts = {};
        itemOpts = {
            region_id: temItem.REGION_ID || temItem.region_id,
            region_code: temItem.REGION_CODE || temItem.region_code,
            region_name: temItem.REGION_NAME || temItem.region_name,
            parent_id: temItem.PARENT_ID || temItem.parent_id,
            region_level: temItem.REGION_LEVEL || temItem.region_level,
            region_order: temItem.REGION_ORDER || temItem.region_order,
            region_name_en: temItem.REGION_NAME_EN || temItem.region_name_en,
            region_short_name_en: temItem.REGION_SHORTNAME_EN || temItem.region_short_name_en
        }


        return itemOpts || null;
    }
}

if(typeof module !== undefined){
    module.exports = EJ;
}