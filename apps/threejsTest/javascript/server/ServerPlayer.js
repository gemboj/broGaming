function ServerPlayer(id, position){
    GameObject.call(this, id, position);

    this.delta = {
        x: 0,
        y: 0,
        z: 0
    }

    this.color = {
        r: 200,
        g: 200,
        b: 200
    }
}

ServerPlayer.prototype = Object.create(GameObject.prototype);
ServerPlayer.prototype.constructor = ServerPlayer;

ServerPlayer.prototype.update = function(delta){
    this.position = {
        x: this.position.x + this.delta.x,
        y: this.position.y + this.delta.y,
        z: this.position.z + this.delta.z
    }
};

ServerPlayer.prototype.serialize = function(){
    var serializedGameObject = GameObject.prototype.serialize.call(this);

    serializedGameObject.delta = this.delta;
    serializedGameObject.color = this.color;

    return serializedGameObject;
};


ServerPlayer.prototype.deserialize = function(data){
    var movingDirection = data.movingDirection;

    if(movingDirection.up){
        this.delta.y = 1;
    }
    else if(movingDirection.down){
        this.delta.y = -1;
    }
    else{
        this.delta.y = 0;
    }


    if(movingDirection.left){
        this.delta.x = -1;
    }
    else if(movingDirection.right){
        this.delta.x = 1;
    }
    else{
        this.delta.x = 0;
    }
};