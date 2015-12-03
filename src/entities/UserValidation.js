function UserValidation(username, password){
    var that = this;

    this.username = username;
    this.password = password;

    this.validate = function(){
        var errors = {
            username: {},
            password: {}
        };

        var invalid = false;

        if(that.username && that.username.length < 3){
            invalid = true;
            errors.username.tooShort = 'username is too short (min. 3 characters)';
        }

        return invalid ? errors : null;
    };
}