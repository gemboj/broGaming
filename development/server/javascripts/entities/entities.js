var entities = {};


entities.User = function(_username, _password, usersRepo){
    var username = _username;
    var password = _password;

    var userExistsT = 'User already exists.';

    this.getUsername = function(){
        return username;
    };

    this.getPassword = function(){
        return password;
    };

    this.isValid = function(){
        return usersRepo.getUsersByUsername(username)
            .then(function(users){
                if(users.length === 0){
                    return;
                }
                throw userExistsT;
            })
            .catch(function(err){
                throw err;
            });
    }
}
entities.UserLogged = function(_username){
    var username = _username;

    this.getUsername = function(){
        return username;
    };

    this.isValid = function(){
        return new Promise.resolve();
    }
}

module.exports = entities;