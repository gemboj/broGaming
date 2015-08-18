function LoggedUsersRepository(lokiDb) {
    var that = this;
    var usersCollection = lokiDb.getUsersCollection();

    that.findUsersByUsername = function (input) {
        return new Promise(function (resolve, reject) {
            var users = usersCollection.find({username: input.username});

            resolve(users);
        })
    };

    that.insertUser = function (user) {
        return new Promise(function (resolve, reject) {
            usersCollection.insert(user);

            resolve();
        })
    };

    that.removeUser = function (user) {
        return new Promise(function (resolve, reject) {
            usersCollection.remove(user);

            resolve();
        })
    };
}