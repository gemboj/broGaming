function Player(input){
    this.object3d = input.object3d;
    this.id = input.id;
}

Player.prototype.update = function(position){
    this.object3d.position.x = position.x;
    this.object3d.position.y = position.y;
    this.object3d.position.z = position.z;
};