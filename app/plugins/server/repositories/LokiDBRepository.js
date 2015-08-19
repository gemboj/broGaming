function LokiDBRepository(Loki){
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