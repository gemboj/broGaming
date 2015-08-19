var authorization = {};
var entities = require("./../entities/entities");

authorization.AuthenticateUser = function(findUsersByUsername) {
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

authorization.Login = function(insertLoggedUser){
    var that = this;

    that.alreadyLogged = 'User is already logged in.';

    that.do = function(username){
        return insertLoggedUser(new entities.LoggedUser(username))
            .catch(function () {
                throw that.alreadyLogged;
            });
    }
}
authorization.Logout = function(removeLoggedUserByUsername){
    var that = this;

    that.do = function(username){
        return removeLoggedUserByUsername(username);
    }
}
authorization.VerifyConnection = function(authenticateUser, login){
    var that = this;
    
    that.do = function (input) {//username, password
        return authenticateUser(input)
            .then(function () {
                return login(input.username);
            })
    }
}

module.exports = authorization;