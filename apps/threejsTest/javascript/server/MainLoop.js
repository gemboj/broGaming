function MainLoop(scene, broadcast, loopInterval){
    this.scene = scene;
    this.broadcast = broadcast;

    this.loopInterval = loopInterval == undefined ? 50 : loopInterval;

    this.loopHandle = null;

    this.timer = {
        getTime: function(){
            return (new Date()).getTime();
        },
        lastTime: 0,

        getDelta: function(){
            var time = this.getTime(),
                delta = time - this.lastTime;

            this.lastTime = time;

            return delta;
        }
    }
}

MainLoop.prototype.start = function(){
    var that = this;

    this.timer.getDelta();

    this.loopHandle = setInterval(function(){
        that.scene.updateAll(that.timer.getDelta());

        var gameStateData = that.scene.serialize();

        that.broadcast("gameStateUpdate", gameStateData);
    }, this.loopInterval);
};

MainLoop.prototype.stop = function(){
    clearInterval(this.loopHandle);
};