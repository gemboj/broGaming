var repositories = {};


repositories.UserRepository = function(orm){
    var that = this;

    that.orm = orm;

    that.findUsersByUsername = function(input){
        return new Promise(function (resolve, reject){
            orm.connect("mysql://root:@localhost/broGaming", function (err, db) {
                if(err) return reject(err);

                var User = loadUser(db);

                User.find({ username: input.username }, function (err, users) {
                    if(err) return reject(err);

                    resolve(users);
                });
            });
        })
    };

    var loadUser = function(db){
        return db.define("users", {
            username      : String,
            password   : String
        },{
            id: 'username'
        });
    }
}

module.exports = repositories;