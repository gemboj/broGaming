var repositories = {};
var plugins = require(".logic/entities/server/entities");

repositories.LokiDB = function(Loki){
    var that = this;

    var db  = new Loki('broGamingChat.json');

    var users = db.addCollection('users');

    that.getDb = function(){
        return db;
    }
}
repositories.OrmDB = function(orm){
    var that = this;
    that.orm = orm;

    var db  = null;

    that.connect = function(url){
        return new Promise(function (resolve, reject) {
            orm.connect(url, function (err, _db) {
                if(err) reject(err);
                db = _db;

                that.getDb = function(){
                    return db;
                };

                resolve();
            });
        });
    };

    that.getDb = function(){
        throw 'not connected to database';
    }
}
repositories.plugins.UsersRepository = function(ormRepository) {
    var that = this;

    that.findplugins.UsersByplugins.Username = function (input) {
        var db = ormRepository.getDb();
        var plugins.User = loadplugins.User(db);

        return new Promise(function (resolve, reject) {
            plugins.User.find({username: input.username}, function (err, modelplugins.Users) {
                if (err) return reject(err);

                resolve(createplugins.Users(modelplugins.Users));
            });
        })
    };

    var loadplugins.User = function (db) {
        return db.define("users", {
            username: String,
            password: String
        }, {
            id: 'username'
        });
    }

    var createplugins.Users = function(modelplugins.Users){
        var users = [];
        for(var i = 0; i < modelplugins.Users.length; ++i){
            users.push(new plugins.User(model.username, model.password));
        }
        return users;
    }
}

module.exports = repositories;