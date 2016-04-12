function GameObject(position){
    this.position = position;
}

GameObject.prototype.deserialize = function(data){
    this.position.set(data.position);
};