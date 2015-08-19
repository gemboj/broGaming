function Login(findUsersByUsername, insertLoggedUser){
    var that = this;

    that.alreadyLogged = 'User is already logged in.';

    that.do = function(username){
        return findUsersByUsername(username)
                .then(function (users) {
                    if(users.length === 0){
                        return insertLoggedUser(new LoggedUser(username));
                    }

                    throw that.alreadyLogged;
                })
    }
}