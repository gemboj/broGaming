function Room(id, name, deletable, users){
    this.id = id;
    this.name = name;
    this.deletable = deletable === undefined ? true : deletable;
    this.users = users;

    this.getId = function(){
        return this.id;
    };
}