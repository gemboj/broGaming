function Register(hash, validateRegistrationUser, addUser, sendEmail, setActivationLink, generateRandomBytes, address){
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
                return addUser(user)
                    .then(function(){
                        return generateRandomBytes(30);
                    })
                    .then(function(_link){
                        link = _link;
                        return setActivationLink(user.username, link);
                    })
                    .catch(function(err){
                        throw 'registration failed. Please try again later.';
                    });
            })
            .then(function(){
                return sendEmail(email, 'Click here to complete you registration:\n' + address + '/activateAccount/' + link)
                    .catch(function(err){
                        throw 'registration failed. Please try again later.';
                    });
            })
            .then(function(){
                return 'registered'
            })
    }
}