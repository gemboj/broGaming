function Login(loggedUsersRepo){
    var that = this;

    that.alreadyLogged = 'User is already logged in.';

    that.do = function(username){
        return loggedUsersRepo.findUsersByUsername(username)
                .then(function (users) {
                    if(users.length === 0){
                        return loggedUsersRepo.insertUser(new LoggedUser(username));
                    }

                    throw that.alreadyLogged;
                })
    }
}