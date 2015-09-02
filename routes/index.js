var express = require('express');
var router = express.Router();
var fs = require('fs'),
    path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'BroGaming' });
});

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

var apps = getDirectories('./development/client/apps');
var url = 'apps/';
router.get('/apps', function(req, res, next) {
    res.render('apps', { apps: apps, url: url });
});


module.exports = router;
