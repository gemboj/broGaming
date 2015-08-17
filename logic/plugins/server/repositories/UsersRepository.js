function UsersRepository(ormRepository) {
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
            users.push(new User(model.username, model.password));
        }
        return users;
    }
}