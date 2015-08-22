function Login(isAuthenticCredentials, markAsLoggedUsername){
    var that = this;

    that.alreadyLogged = 'User is already logged in.';
    that.invalidCredentials = 'Invalid credentials';

    that.do = function(credentials){//username, password
        return isAuthenticCredentials(credentials)
            .then(function(){
                return markAsLoggedUsername(credentials.username)
            })
            .catch(function(err){
                throw that[err];
            })
    }
}