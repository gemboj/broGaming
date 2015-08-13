function Authenticate(findUserByUsername, success, fail){
    var that = this;
    that.findUserByUsername = findUserByUsername;
    that.success = success;
    that.fail = fail;

    that.wrongUserT = 'Wrong username or password';

    that.do = function(credentials) {
        var user = that.findUserByUsername(credentials.username)

        if (user && user.getPassword() === credentials.password) {
            that.success();
        }
        else {
            that.fail(that.wrongUserT);
        }
    }
}
