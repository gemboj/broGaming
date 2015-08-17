var entities = {};


entities.User = function(_username, _password, usersRepo){
    var username = _username;
    var password = _password;

    var userExistsT = 'entities.User already exists.';

    this.getentities.Username = function(){
        return username;
    };

    this.getPassword = function(){
        return password;
    };

    this.isValid = function(){
        return usersRepo.getentities.UsersByentities.Username(username)
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