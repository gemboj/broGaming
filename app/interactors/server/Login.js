function Login(loggedUsersRepo){
    var that = this;

    that.alreadyLogged = 'User is already logged in.';

    that.do = function(input){//username
        return loggedUsersRepo.getUsersByUsername(input.username)
                .then(function (users) {
                    if(users.length === 0){
                        return loggedUsersRepo.insertUser(new LoggedUser(input.username));
                    }

                    throw that.alreadyLogged;
                })
    }
}