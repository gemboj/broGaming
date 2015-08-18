var repositories = {};
var entities = require("./../entities/entities");

repositories.LoggedUsersRepository = function(lokiDb) {
    var that = this;
    var usersCollection = lokiDb.getUsersCollection();

    that.findUsersByUsername = function (input) {
        return new Promise(function (resolve, reject) {
            var users = usersCollection.find({username: input.username});

            resolve(users);
        })
    };

    that.insertUser = function (input) {
        return new Promise(function (resolve, reject) {
            usersCollection.insert(input.user);

            resolve();
        })
    };
}
repositories.LokiDB = function(Loki){
    var that = this;

    var db  = new Loki('broGamingChat.json');

    var users = db.addCollection('users');

    that.getDb = function(){
        return db;
    }

    that.getUsersCollection = function(){
        return users;
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