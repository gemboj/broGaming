function Logout(markAsNotLoggedUser, removeUsernameFromAllRooms){
    var that = this;

    that.do = function(username){
        return markAsNotLoggedUser(username)
            .then(function(){
                return removeUsernameFromAllRooms(username);
            });
    }
}