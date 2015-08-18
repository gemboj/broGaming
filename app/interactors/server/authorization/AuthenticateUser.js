function AuthenticateUser(findUsersByUsername) {
    var that = this;
    that.findUsersByUsername = findUsersByUsername;

    that.wrongUserT = 'Wrong username or password';

    that.do = function (input) {//username
        return that.findUsersByUsername(input)
            .then(function (users) {
                if (users.length === 1 && users[0].getPassword() === input.password) {
                    return;
                }
                throw that.wrongUserT;
            })
            .catch(function (e) {
                throw e;
            })
    }
}
