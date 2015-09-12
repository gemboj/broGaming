function UserRegistrationForm(UserLoginForm){
    var that = this;

    this.do = function(username, password, email){
        var result = UserLoginForm(username, password);
        result.addProperty('email');


        var regexResult = /.+@.+\..+/.exec(email);
        if(regexResult === null){
            result.email.invalid = 'invalid email';
        }

        return result;
    }
}