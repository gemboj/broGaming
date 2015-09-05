function ValidateUser(getUserByUsername){
    var that = this;

    this.do = function(user){

        return getUserByUsername(user.username)
            .then(function(_user){
                var entityErrors = user.validate();
                if(entityErrors){
                    throw 'invalid user';
                }

                if(_user && user.username === _user.username){
                    throw 'username already exists';
                }
            })
    }
}