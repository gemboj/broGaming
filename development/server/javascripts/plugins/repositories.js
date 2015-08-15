var repositories = {};


repositories.OrmRepository = function(orm){
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
        var User = loadUser(db);

        return new Promise(function (resolve, reject) {
            User.find({username: input.username}, function (err, users) {
                if (err) return reject(err);

                resolve(users);
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
}

module.exports = repositories;