function ClientPlayerBase(input){
    this.object3d = input.object3d;
    this.id = input.id;
}

ClientPlayerBase.prototype.update = function(){
    throw "update method not implemented"
};