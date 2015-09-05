function User(_username, _password, _isLogged, _isActive, _rooms){
    UserValidation.call(this, _username, _password);

    this.isLogged = _isLogged;
    this.isActive = _isActive;
    this.rooms = _rooms;

    this.getUsername = function(){
        return username;
    };
}