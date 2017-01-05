var express = require('express');
var router = express.Router();

var EJ = require('../public/javascripts/EJ')


/* GET home page. */
router.get('/', function(req, res, next) {
    var excelFileUrl = process.cwd() + '/public/javascripts/test.xlsx';
    var data = EJ.getExcelData(excelFileUrl);
    res.render('index', { title: 'Express!', content: data});
});

module.exports = router;
