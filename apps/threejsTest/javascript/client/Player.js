function Player(input){
    ClientPlayerBase.call(this, input);
}

Player.prototype = Object.create(ClientPlayerBase.prototype);
Player.prototype.constructor =
Player;

Player.prototype.update = function(position){
    this.object3d.position.x = position.x;
    this.object3d.position.y = position.y;
    this.object3d.position.z = position.z;
};