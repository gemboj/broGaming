function LoggedUser(_username){
    this.username = _username;

    this.getUsername = function(){
        return this.username;
    };

    this.isValid = function(){
        return new Promise.resolve();
    }
}