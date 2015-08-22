function User(_username, _password, _isLogged, _isActive){
    var username = _username;
    var password = _password;
    var isLogged = _isLogged;
    var isActive = _isActive;

    this.getUsername = function(){
        return username;
    };

    this.getPassword = function(){
        return password;
    };
}