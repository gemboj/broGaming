var entities = {};


entities.LoggedUser = function(_username){
    this.username = _username;

    this.getUsername = function(){
        return this.username;
    };

    this.isValid = function(){
        return new Promise.resolve();
    }
}
entities.Room = function(id, name, deletable){
    this.id = id;
    this.name = name;
    this.deletable = deletable === undefined ? true : deletable;

    this.getId = function(){
        return this.id;
    }

    this.getName = function(){
        return this.name;
    }

    this.isDeletable = function(){
        return this.deletable;
    }
}
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

    /*this.isValid = function(){
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
    }*/
}

module.exports = entities;