function Room(id, name, deletable){
    this.id = id;
    this.name = name;
    this.deletable = deletable === undefined ? true : deletable;

    this.getId = function(){
        return this.id;
    }

    this.getName = function(){
        return this.name;
    }

    this.isDeletable = function(){
        return this.deletable;
    }
}