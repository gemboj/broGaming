function UserRegistration(getUserByUsername, validateUserRegistration){
    var that = this;

    this.do = function(username, password, email){

        return getUserByUsername(username)
            .then(function(_user){
                var registrationErrors = validateUserRegistration(username, password, email);

                var error = registrationErrors.getError();
                if(error !== ''){
                    throw error;
                }

                if(_user){
                    if(username === _user.username){
                        throw 'username already exists';
                    }
                }
            })
    }
}