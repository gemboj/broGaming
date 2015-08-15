function UsersRepository(ormRepository) {
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