function GameObject(id, position){
    this.position = position;
    this.id = id;
}

GameObject.prototype.getID = function(){
    return this.id;
};

GameObject.prototype.update = function(time){
    this.position.add(0.0001 * time, 0, 0)
};

GameObject.prototype.getPosition = function(){
    return this.position;
};

GameObject.prototype.setPosition = function(position){
    this.position = position;
};