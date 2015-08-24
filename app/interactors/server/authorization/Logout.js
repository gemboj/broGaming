function Logout(markAsNotLoggedUser, getUsernameRooms, leaveRoom){
    var that = this;

    that.do = function(username){
        return markAsNotLoggedUser(username)
            .then(function(){
                return getUsernameRooms(username);
            })
            .then(function(rooms){
                for(var i = 0; i < rooms.length; ++i){
                    leaveRoom(username, rooms[i].id);
                }
            })
            .catch(function(err){
                console.log(err);
            });
    }
}