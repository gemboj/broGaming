function Login(getUserByUsername, markAsLoggedUsername, compareHash){
    var that = this;

    that.alreadyLogged = 'User is already logged in.';
    that.invalidCredentials = 'Invalid credentials';

    that.do = function(credentials){//username, password
        var user = null;
        return getUserByUsername(credentials.username)
            .then(function(_user){
                if(_user === null){
                    throw that.invalidCredentials;
                }

                user = _user;

                return compareHash(credentials.password, _user.password);
            })
            .then(function(passwordMatch){
                if(!passwordMatch){
                    throw that.invalidCredentials;
                }
            })
            .then(function(){
                if(!user.isActive){
                    throw 'user ' + user.username + ' is not activated';
                }
            })
            .then(function(){
                return markAsLoggedUsername(credentials.username)
                    .catch(function(err){
                        if(that[err] !== undefined){
                            throw that[err]
                        }
                    });
            })
    }
}