function JoinRoom(usernameJoinsRoomid, getRoomWithUsersById, send, transaction){
    var that = this;

    that.do = function(username, roomId, t){
        roomId = roomId === undefined ? 0 : roomId;

        return transaction(function(_t){
            var transaction = t !== undefined ? t : _t;
            return usernameJoinsRoomid(username, roomId, transaction)
                .then(function(){
                    return getRoomWithUsersById(roomId, transaction);
                })
                .catch(function(err){
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
                    id: roomId,
                    name: room.name,
                    usernames: usersNicks,
                    host: room.host.username
                };

                for(var i = 0; i < users.length; ++i){
                    if(users[i].username !== username){
                        send(users[i].username, 'someoneJoinedRoom', {roomId: room.id, username: username});
                    }
                }

                return data;
            })
            .catch(function(err){
                send(username, 'error', err);
                throw err;
            });
    }
}