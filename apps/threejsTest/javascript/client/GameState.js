function GameState(communicator, sceneGenerator, clientStateSendLoop){


    this.communicator = communicator;
    this.sceneGenerator = sceneGenerator;

    this.clientStateSendLoop = clientStateSendLoop;

    this.scene = null;
    this.renderLoop = null;
}

GameState.prototype.updateScene = function(specification){
    this.scene.update(specification);
};

GameState.prototype.start = function(gameSpecification){
    this.scene = this.sceneGenerator.generate(gameSpecification);
    this.renderLoop = new RenderLoop(this.sceneGenerator.getRenderFunction());

    this.renderLoop.start();
    this.clientStateSendLoop.start();
};

GameState.prototype.onConnect = function(){};
GameState.prototype.onDisconnect = function(){};
GameState.prototype.onError = function(){};