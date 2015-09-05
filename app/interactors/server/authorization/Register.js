function Register(hash, validateUser, addUser){
    var that = this;

    this.do = function(username, password){
        return hash(password)
            .then(function(hash){
                var user = new User(username, hash, false, true);
                return validateUser(user);
            })
            .then(function(user){
                return addUser(user)
                    .catch(function(err){
                        throw 'registration failed. Please try again later.';
                    });
            })
            .then(function(){
                return 'registered'
            })
    }
}