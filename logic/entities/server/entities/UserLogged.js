function UserLogged(_username){
    var username = _username;

    this.getUsername = function(){
        return username;
    };

    this.isValid = function(){
        return new Promise.resolve();
    }
}