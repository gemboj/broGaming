function Room(id, name, deletable, users, host){
    this.id = id;
    this.name = name;
    this.deletable = deletable === undefined ? true : deletable;
    this.users = users;
    this.host = host;

    this.getId = function(){
        return this.id;
    };
}