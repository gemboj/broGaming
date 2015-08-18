function ShowLogin(showLogin){
    var that = this;

    that.do = function(username){
        showLogin(username);
    }
}