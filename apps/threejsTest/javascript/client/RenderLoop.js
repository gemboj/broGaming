function RenderLoop(){
    this.render = function(){};
    this.loopHandle = null;
}

RenderLoop.prototype.setRenderFunction = function(render){
    this.render = render;
};

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