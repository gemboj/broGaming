function Login(insertLoggedUser){
    var that = this;

    that.alreadyLogged = 'User is already logged in.';

    that.do = function(username){
        return insertLoggedUser(new LoggedUser(username))
            .catch(function(){
                throw that.alreadyLogged;
            });
    }
}