function Logout(markAsNotLogged, removeFromRooms){
    var that = this;

    that.do = function(username){
        return markAsNotLogged(username)
            .then(function(){
                return removeFromRooms(username);
            });
    }
}