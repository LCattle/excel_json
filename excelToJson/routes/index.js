var express = require('express');
var router = express.Router();

var EJ = require('../public/javascripts/EJ')


/* GET home page. */
router.get('/', function(req, res, next) {
    var excelFileUrl = process.cwd() + '\\public\\data\\test.xlsx';
    console.log(excelFileUrl)
    EJ.getExcelData(excelFileUrl);
    res.render('index', { title: 'Excel To Json'});
});

module.exports = router;
