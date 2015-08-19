function LoggedUsersRepository(lokiDb) {
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