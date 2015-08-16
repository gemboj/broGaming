var entities = {};


entities.User = function(_username){
    var username = _username;

    this.getentities.Username = function(){
        return username;
    }
}

module.exports = entities;