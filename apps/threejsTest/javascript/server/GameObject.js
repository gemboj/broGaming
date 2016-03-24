function GameObject(position){
    this.position = position;
}

GameObject.prototype.move = function(x, y, z){
    this.position.add(x, y, z)
};

GameObject.prototype.setPosition = function(x, y, z){
    this.position.setPosition(x, y, z)
};

GameObject.prototype.update = function(time){
    this.position.add(0.0001 * time, 0, 0)
};

GameObject.prototype.getPosition = function(){
    return this.position.serialize();
};