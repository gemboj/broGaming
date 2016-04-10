function GameObject(id, position){
    this.position = {
        x: position[0],
        y: position[1],
        z: position[2]
    };
    this.id = id;
}

GameObject.prototype.getId = function(){
    return this.id;
};

GameObject.prototype.update = function(time){

};

GameObject.prototype.getPosition = function(){
    return this.position;
};

GameObject.prototype.setPosition = function(position){
    this.position = position;
};

GameObject.prototype.serialize = function(){
    return {
        id: this.id,
        position: this.position
    }
};

GameObject.prototype.deserialize = function(data){

};