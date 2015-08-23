function JoinRoom(transaction, usernameJoinsRoomid, getUsersInRoomid, send){
    var that = this;


    that.do = function(username, roomId){
        roomId = roomId === undefined ? 0 : roomId;

        return transaction(function(t){
            return usernameJoinsRoomid(username, roomId, t)
                .then(function(){
                    return getUsersInRoomid(roomId, t);
                })
                .catch(function(){
                    throw 'could not join room';
                })
        })
            .then(function(users){
                var usersNicks = []
                for(var i = 0; i < users.length; ++i){
                    usersNicks.push(users[i].username);
                }

                var data = {};
                data[roomId] = usersNicks;
                send(username, 'roomUsers', data);
            })
            .catch(function(err){
                send(username, 'error', 'could not join room');
                throw err;
            });
    }
}