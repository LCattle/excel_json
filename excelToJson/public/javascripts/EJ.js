var XL = require('xlsx');
var fs = require('fs');
var EJ = {
    _init: function(){

    },
    allDataTmp: function(){
        var allDatas = new Object();
        allDatas.provinceData = [];
        allDatas.cityData = [];
        allDatas.countyData = [];
        allDatas.templateData = [];
        return allDatas;
    },
    getExcelData: function(fileUrl) {
        var self = this;
        if(!fileUrl){
            console.log('请传入文件的绝对位置！')
            return;
        }
        var allDatas = this.allDataTmp();
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
            for(var i = 0; i < jsonData.length; i++){
                temItem = jsonData[i];
                itemOpts = this.setItemOpts(temItem);
                tmpData.push(itemOpts)
            }
            //获到省份
            var proTem = null
            var proOpts = {}
            for(var j = 0; j < tmpData.length; j++){
                proTem = tmpData[j];
                proOpts = this.setItemOpts(proTem);
                if(/^([1-9][0-9])0000$/.test(proTem.region_code)){
                    //console.log('省份匹配上了。： ' + proOpts.region_code)
                    allDatas.provinceData.push(proOpts);
                }else{
                    //console.log('省份匹配不上了！： ' + proOpts.region_code)
                    allDatas.templateData.push(proOpts);
                }
            }
           this.toJsonFile(allDatas);
        }
        //return testString || null;
    },
    toJsonFile: function(allDatas){
        if(!allDatas){
            return;
        }
        var provinceTmp = allDatas.provinceData;
        var otherTmp = allDatas.templateData;
        var proItem = null;
        var otherItem = null;
        var countyItem = null;
        var cityItem = null;
        var cityOpts = {};
        var countyOpts = {};
        var provicesData = [];
        var proObj = {
        }
        var cityObj = {
        }
        var disObj = {
            keycode: '4400103',
            name:'白云区'
        }
        //编好数据格式
        //获取对应的市
        //获取对应的县
        for(var i = 0; i < provinceTmp.length; i++){
            proItem = provinceTmp[i];
            proObj = {
                keycode:proItem.region_code,
                name: proItem.region_name,
                region_id: proItem.region_id,
                city:[],
            }
            for(var j = 0; j < otherTmp.length; j++){
                otherItem = otherTmp[j];
                if(otherItem.parent_id == proItem.region_id){
                    cityOpts = this.setItemOpts(otherItem);
                    cityObj = {
                        keycode:cityOpts.region_code,
                        name: cityOpts.region_name,
                        parent_id: cityOpts.parent_id,
                        region_id: cityOpts.region_id,
                        districts:[]
                    }
                    proObj.city.push(cityObj)
                    allDatas.cityData.push(cityOpts)
                }else{
                    countyOpts = this.setItemOpts(otherItem);
                    allDatas.templateData.push(countyOpts)
                }

            }
             provicesData.push(proObj);

        }

        console.log('lengthAAA:' + otherTmp.length)
        for(var p = 0; p < otherTmp.length; p++){
            console.log(otherTmp[p].region_name)
            /*if(allDatas.templateData[p].region_name == '揭西县'){
                console.log(allDatas.templateData[p].region_name)
            }*/
        }

        /*for(var k = 0; k < provicesData.length; k++){
            proItem = provicesData[k]
            for(var l = 0; l < proItem.city.length; l++){
                cityItem = proItem.city[l];
                for(var n = 0; n < allDatas.countyData.length; n++){
                    countyItem = allDatas.countyData[n];
                    if(countyItem.parent_id == cityItem.region_id){
                        //console.log('------------------')
                        //console.log(countyItem.region_name)
                        disObj = {
                            keycode: countyItem.region_code,
                            name: countyItem.region_name,
                            parent_id: countyItem.parent_id
                        }
                        cityItem.districts.push(disObj)
                    }
                }
            }
        }*/

        //console.log(provicesData)
       // this.jsonWiteFile(provicesData);

    },
    jsonWiteFile: function(data){
        fs.writeFile('provinces.json', JSON.stringify(data), function (err) {
            if (err) throw err;
            console.log('写入完成');
        });

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