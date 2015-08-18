var server = {};


server.AuthenticateUser = function(findUsersByUsername) {
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

server.Login = function(loggedUsersRepo){
    var that = this;

    that.alreadyLogged = 'User is already logged in.';

    that.do = function(input){//username
        return loggedUsersRepo.getUsersByUsername(input.username)
                .then(function (users) {
                    if(users.length === 0){
                        return loggedUsersRepo.insertUser(new LoggedUser(input.username));
                    }

                    throw that.alreadyLogged;
                })
    }
}
server.VerifyConnection = function(authenticateUser, login){
    var that = this;
    
    that.do = function (input) {//username
        return authenticateUser(input)
            .then(function () {
                return login(input);
            })
            .catch(function (err) {
                throw err;
            })
    }
}

module.exports = server;