function Client(input){
    var that = this;

    input.$div.ready(function(){

        var $canvas = input.$div.find('canvas');

        that.communicator = new Communicator(input.webRTCChannel);
        var inputReader = new InputReader($canvas[0]);


        var clientState = new ClientState();

        var inputAdapter = new InputAdapter(inputReader, clientState);
        inputReader.registerKeyboardInputHandler(inputAdapter);

        that.clientStateSendLoop = new ClientStateSendLoop(clientState, that.communicator);
        that.renderLoop = new RenderLoop();

        var sceneGenerator = new ThreejsSceneGenerator($canvas[0]);

        that.gameState = new GameState(that.communicator, sceneGenerator, that.clientStateSendLoop, that.renderLoop, input.showInfo);
        that.communicator.registerMessageHandler(that.gameState);
    });
}

Client.prototype.close = function(){
    this.gameState.close();
};