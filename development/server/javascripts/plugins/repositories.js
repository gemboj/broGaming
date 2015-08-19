var repositories = {};
var entities = require("./../entities/entities");

repositories.LoggedUsersRepository = function(lokiDb) {
    var that = this;
    var collections = lokiDb.getCollections();

    that.findUsersByUsername = function (input) {
        return new Promise(function (resolve, reject) {
            var users = collections.loggedUsers.find({username: input.username});

            resolve(users);
        })
    };

    that.insertUser = function (user) {
        return new Promise(function (resolve, reject) {
            collections.loggedUsers.insert(user);

            resolve();
        })
    };

    that.removeUser = function (user) {
        return new Promise(function (resolve, reject) {
            collections.loggedUsers.remove(user);

            resolve();
        })
    };
}
repositories.LokiDBRepository = function(Loki){
    var that = this;

    var db  = new Loki('broGamingChat.json');

    var loggedUsers = db.addCollection('users');
    var rooms = db.addCollection('rooms');
    var loggedUsers_rooms = db.addCollection('loggedUsers_rooms');

    that.findLoggedUsersByUsername = function (username) {
        return new Promise(function (resolve, reject) {
            var users = loggedUsers.find({username: username});

            resolve(users);
        })
    };

    that.insertLoggedUser = function (user) {
        return new Promise(function (resolve, reject) {
            loggedUsers.insert(user);

            resolve();
        })
    };

    that.removeLoggedUserByUsername = function (username) {
        return new Promise(function (resolve, reject) {
            loggedUsers.removeWhere({username: {$eq: username}});
            loggedUsers_rooms.removeWhere({username: {$eq: username}});

            resolve();
        })
    };
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
repositories.UsersRepository = function(ormRepository) {
    var that = this;

    that.findUsersByUsername = function (input) {
        var db = ormRepository.getDb();
        var user = loadUser(db);

        return new Promise(function (resolve, reject) {
            user.find({username: input.username}, function (err, modelUsers) {
                if (err) return reject(err);

                resolve(createUsers(modelUsers));
            });
        })
    };

    var loadUser = function (db) {
        return db.define("users", {
            username: String,
            password: String
        }, {
            id: 'username'
        });
    }

    var createUsers = function(modelUsers){
        var users = [];
        for(var i = 0; i < modelUsers.length; ++i){
            users.push(new entities.User(modelUsers[i].username, modelUsers[i].password));
        }
        return users;
    }
}

module.exports = repositories;