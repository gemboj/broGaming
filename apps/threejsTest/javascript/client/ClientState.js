function ClientState(){
    this.movingDirection = {
        left: false,
        right: false,
        up: false,
        down: false
    };

    this.onStateChange = function(){};
}

ClientState.prototype.move = function(direction, isMoving){
    this.movingDirection[direction] = isMoving;

    this.onStateChange(this.serialize());
};

ClientState.prototype.registerOnStateChange = function(fun){
    this.onStateChange = fun;
};

ClientState.prototype.serialize = function(){
    return {
        movingDirection: this.movingDirection
    }
};