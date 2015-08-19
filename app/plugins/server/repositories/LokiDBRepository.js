function LokiDBRepository(Loki) {
    var that = this;

    var db = new Loki('broGamingChat.json');

    var loggedUsers = db.addCollection('users');
    var rooms = db.addCollection('rooms');
    var loggedUsers_rooms = db.addCollection('loggedUsers_rooms');
    var roomsIdCounter = db.addCollection('roomsIdCounter');
    roomsIdCounter.insert({id: 0});

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

    that.getNextRoomid = function(){
        return new Promise(function (resolve, reject) {
            var nextId = null;
            roomsIdCounter.update(function(obj){
                nextId = obj.id;
                return ++obj.id;
            });

            resolve(nextId);
        })
    };

    that.usernameJoinsRoomid = function(username, roomId){
        return new Promise(function (resolve, reject) {
            loggedUsers_rooms.insert({username : username, roomId: roomId});

            resolve();
        })
    };

    that.getLoggedUsersInRoomid = function(roomid){
        return new Promise(function(resolve, reject){
            var users_rooms = loggedUsers_rooms.find({roomId : {'$eq' : roomid}});
            var users = [];
            for(var i = 0; i < users_rooms.length; ++i){
                users.push(loggedUsers.find({username : {'$eq' : users_rooms[i].username}})[0]);
            }

            resolve(users);
        })
    }
}