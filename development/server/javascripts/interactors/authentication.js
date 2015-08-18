var authentication = {};
var entities = require("./../entities/entities");

authentication.AuthenticateUser = function(findUsersByUsername) {
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

authentication.Login = function(loggedUsersRepo){
    var that = this;

    that.alreadyLogged = 'User is already logged in.';

    that.do = function(username){
        return loggedUsersRepo.findUsersByUsername(username)
                .then(function (users) {
                    if(users.length === 0){
                        return loggedUsersRepo.insertUser(new entities.LoggedUser(username));
                    }

                    throw that.alreadyLogged;
                })
    }
}
authentication.VerifyConnection = function(authenticateUser, login){
    var that = this;
    
    that.do = function (input) {//username, password
        return authenticateUser(input)
            .then(function () {
                return login(input.username);
            })
    }
}

module.exports = authentication;