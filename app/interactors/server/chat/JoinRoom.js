function JoinRoom(transaction, usernameJoinsRoomid, getRoomWithUsersById, send){
    var that = this;

    that.do = function(username, roomId){
        roomId = roomId === undefined ? 0 : roomId;

        return transaction(function(t){
            return usernameJoinsRoomid(username, roomId, t)
                .then(function(){
                    return getRoomWithUsersById(roomId, t);
                })
                .catch(function(err){
                    console.log(err);
                    throw 'could not join room';
                })
        })
            .then(function(room){
                var usersNicks = [];

                var users = room.users;
                for(var i = 0; i < users.length; ++i){
                    usersNicks.push(users[i].username);
                }

                var data = {
                    id : roomId,
                    name : room.name,
                    usernames : usersNicks
                };

                for(var i = 0; i < users.length; ++i){
                    if(users[i].username !== username){
                        send(users[i].username, 'someoneJoinedRoom', {roomId: room.id, username: username});
                    }
                };

                return data;
            })
            .catch(function(err){
                send(username, 'error', err);
                throw err;
            });
    }
}