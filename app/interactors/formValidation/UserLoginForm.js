function UserLoginForm(){
    var that = this;

    this.do = function(username, password){
        var result = new ValidateError(['username', 'password']);

        if(username.length <= 2){
            result.username.tooShort = 'username is too short (min. 3 characters)';
        }

        if(password.length <= 7){
            result.password.tooShort = 'password is too short (min. 8 characters)';
        }

        return result;
    }
}