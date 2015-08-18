function Logout(removeLoggedUser){
    var that = this;

    that.do = function(username){
        return removeLoggedUser(username);
    }
}