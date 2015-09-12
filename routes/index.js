var express = require('express');
var router = express.Router();
var fs = require('fs'),
    path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    var query = req.query,
        params = {
            title: 'BroGaming'
        };

    if(query.activateSuccess === 'true'){
        params.registerMessage = 'successfully activated account';
    }
    else if(query.activateSuccess === 'false'){
        params.registerMessage = 'invalid activation link';
    }

    res.render('index', params);
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

global.routing = {};
global.routing.user = null;
global.routing.activateAccount = null;

router.post('/user', function(req, res, next){
    var username = req.body.username,
        password = req.body.password,
        email = req.body.email;

    if(global.routing.user !== null){
        global.routing.user(username, password, email)
            .then(function(message){
                return message;
            })
            .catch(function(err){
                return err;
            })
            .then(function(message){
                res.contentType('json');
                res.send({ data: message });
            })
    }
});

router.get('/activateAccount/:link', function(req, res, next){
    var link = req.params.link;

    if(global.routing.activateAccount !== null){
        global.routing.activateAccount(link)
            .then(function(){
                res.redirect('/?activateSuccess=true');
            })
            .catch(function(){
                res.redirect('/?activateSuccess=false')
            });
    }
})

module.exports = router;
