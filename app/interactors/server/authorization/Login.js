function Login(getUserByUsername, markAsLoggedUsername, hash){
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

                return hash(credentials.password);
            })
            .then(function(hashPassword){
                if(hashPassword !== user.password){
                    throw that.invalidCredentials;
                }

                return markAsLoggedUsername(credentials.username)
                    .catch(function(err){
                        if(that[err] !== undefined){
                            throw that[err]
                        }
                    });
            })
    }
}