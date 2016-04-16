function RenderLoop(render){
    this.render = render;
    this.loopHandle = null;
}

RenderLoop.prototype.start = function(){
    var that = this,

        loop = function(){
            this.loopHandle = requestAnimationFrame(loop);

            that.render();
        };

    loop();
};

RenderLoop.prototype.stop = function(){
    cancelAnimationFrame(this.loopHandle);
};