function LokiDBRepository(Loki) {
    var that = this;

    var db = new Loki('broGamingChat.json');

    var loggedUsers = db.addCollection('users');
    var rooms = db.addCollection('rooms');
    var loggedUsers_rooms = db.addCollection('loggedUsers_rooms');

    loggedUsers.ensureUniqueIndex('username');

    that.findLoggedUsersByUsername = function (username) {
        return new Promise(function (resolve, reject) {
            var users = loggedUsers.find({username: username});

            resolve(users);
        })
    };

    that.insertLoggedUser = function (user) {
        return new Promise(function (resolve, reject) {
            var insertedLoggedUser = loggedUsers.insert(user);

            if (insertedLoggedUser === user) {
                resolve();
            }
            else {
                reject();
            }
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