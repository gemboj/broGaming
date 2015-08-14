function Authenticate(findUsersByUsername){
    var that = this;
    that.findUsersByUsername = findUsersByUsername;

    that.wrongUserT = 'Wrong username or password';

    that.do = function(input) {
        that.findUsersByUsername({username: input.username, successCb: function(users){
            if (users.length === 1 && users[0].password === input.password) {
                input.successCb();
            }
            else {
                throw that.wrongUserT;
            }
        }});
    }
}
