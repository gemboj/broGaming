function Register(hash, validateRegistrationUser, addUser, sendEmail, setActivationLink, generateRandomBytes, address, transaction){
    var that = this;

    this.do = function(username, password, email){
        var user = null;

        var link = null;
        return hash(password)
            .then(function(hash){
                user = new User(username, hash, false, false);
                return validateRegistrationUser(username, password, email)
            })
            .then(function(){
                return transaction(function(t){
                    return addUser(user, t)
                        .then(function(){
                            return generateRandomBytes(30);
                        })
                        .then(function(_link){
                            link = _link;
                            return setActivationLink(user.username, link, t);
                        })
                        .then(function(){
                            return sendEmail(email, 'Click here to complete your registration:\n' + address + '/activateAccount/' + link);
                        })
                        .catch(function(err){

                            throw 'registration failed. Please try again later.';
                        });
                })
            })
            .then(function(){
                return 'An activation mail has been sent. Please follow instructions in that email to complete your registration.'
            })
    }
}