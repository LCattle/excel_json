var XL = require('xlsx');
var fs = require('fs');
var EJ = {
    _init: function () {

    },
    allDataTmp: function () {
        var allDatas = new Object();
        allDatas.provinceData = [];
        allDatas.cityData = [];
        allDatas.countyData = [];
        allDatas.templateData = [];
        return allDatas;
    },
    getExcelData: function (fileUrl) {
        if (!fileUrl) {
            console.log('请传入文件的绝对位置！')
            return;
        }
        var allDatas = this.allDataTmp();
        var jsonData = null;
        var lists = XL.readFile(fileUrl);
        if (!lists) {
            console.log('===============>Excel为空！')
        } else {
            var tmpData = [];
            var data = lists.Sheets[lists.SheetNames[0]]
            jsonData = XL.utils.sheet_to_json(data)
            var temItem = null; //暂存所有对象
            var itemOpts = {};//暂存所有对象的属性
            //存储数据
            for (var i = 0; i < jsonData.length; i++) {
                temItem = jsonData[i];
                itemOpts = this.setItemOpts(temItem);
                tmpData.push(itemOpts)
            }
            //获到省份
            var proTem = null
            var proOpts = {}
            for (var j = 0; j < tmpData.length; j++) {
                proTem = tmpData[j];
                proOpts = this.setItemOpts(proTem);
                if (/^([1-9][0-9])0000$/.test(proTem.region_code)) {
                    //过滤省
                    allDatas.provinceData.push(proOpts);
                } else {
                    allDatas.templateData.push(proOpts);
                }
            }
            this.toJsonFile(allDatas);
        }
    },
    toJsonFile: function (allDatas) {
        if (!allDatas) {
            return;
        }
        var provinceTmp = allDatas.provinceData;
        var otherTmp = allDatas.templateData;
        var proItem = null;
        var otherItem = null;
        var countyItem = null;
        var cityItem = null;
        var cityOpts = {};
        var provincesData = [];
        var proObj = {};
        var cityObj = {};
        var disObj = {};
        for (var i = 0; i < provinceTmp.length; i++) {
            proItem = provinceTmp[i];
            proObj = {
                keycode: proItem.region_code,
                name: proItem.region_name,
                region_id: proItem.region_id,
                city: [],
            }
            for (var j = 0; j < otherTmp.length; j++) {
                //过滤到市
                otherItem = '';
                otherItem = otherTmp[j];
                if (otherItem.parent_id == proItem.region_id) {
                    cityOpts = this.setItemOpts(otherItem);
                    cityObj = {
                        keycode: cityOpts.region_code,
                        name: cityOpts.region_name,
                        parent_id: cityOpts.parent_id,
                        region_id: cityOpts.region_id,
                        districts: []
                    }
                    proObj.city.push(cityObj)
                    allDatas.cityData.push(cityOpts)
                }
            }
            provicesData.push(proObj);
        }
        //匹配县/区
        for (var k = 0; k < provincesData.length; k++) {
            proItem = provincesData[k]
            citys = proItem.city;
            if (citys && citys.length > 0) {
                for (var l = 0; l < citys.length; l++) {
                    cityItem = citys[l];
                    if (cityItem && cityItem !== null) {
                        for (var z = 0; z < otherTmp.length; z++) {
                            countyItem = otherTmp[z];
                            if (countyItem.parent_id == cityItem.region_id) {
                                disObj = {
                                    keycode: countyItem.region_code,
                                    name: countyItem.region_name,
                                    parent_id: countyItem.parent_id
                                }
                                cityItem.districts.push(disObj)
                            }
                        }
                    }
                }
            }
        }
        this.jsonWriteFile(provincesData);
    },
    jsonWriteFile: function (data) {
        fs.writeFile('provinces.json', JSON.stringify(data), function (err) {
            if (err) throw err;
            console.log('写入完成');
        });

    },
    setItemOpts: function (temItem) {
        if (!temItem || temItem === '') {
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

if (typeof module !== undefined) {
    module.exports = EJ;
}