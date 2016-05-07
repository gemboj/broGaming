function GameState(communicator, sceneGenerator, clientStateSendLoop, renderLoop, showInfo){


    this.communicator = communicator;
    this.sceneGenerator = sceneGenerator;

    this.clientStateSendLoop = clientStateSendLoop;
    this.renderLoop = renderLoop;

    this.showInfo = showInfo;

    this.scene = null;
}

GameState.prototype.updateScene = function(specification){
    this.scene.update(specification);
};

GameState.prototype.start = function(gameSpecification){
    if(this.scene == null){
        this.scene = this.sceneGenerator.generate(gameSpecification);
        //this.renderLoop = new RenderLoop(this.sceneGenerator.getRenderFunction());
        this.renderLoop.setRenderFunction(this.sceneGenerator.getRenderFunction());

        this.renderLoop.start();
        this.clientStateSendLoop.start();
    }
};

GameState.prototype.pause = function(message){
    this.showInfo(message);
    this.showInfo("Game is paused until player will not reconnect");
};

GameState.prototype.onConnect = function(){};
GameState.prototype.onDisconnect = function(){};
GameState.prototype.onError = function(){};