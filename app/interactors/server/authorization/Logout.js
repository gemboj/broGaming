function Logout(removeLoggedUserByUsername){
    var that = this;

    that.do = function(username){
        return removeLoggedUserByUsername(username);
    }
}