function User(_username, _password, _isLogged, _isActive, _rooms){
    this.username = _username;
    this.password = _password;
    this.isLogged = _isLogged;
    this.isActive = _isActive;
    this.rooms = _rooms;

    this.getUsername = function(){
        return username;
    };

    this.getPassword = function(){
        return password;
    };
}