function Client(input){
    input.$div.ready(function(){

        var $canvas = input.$div.find('canvas');

        var communicator = new Communicator(input.webRTCChannel);
        var inputReader = new InputReader($canvas[0]);


        var clientState = new ClientState();

        var inputAdapter = new InputAdapter(inputReader, clientState);
        inputReader.registerKeyboardInputHandler(inputAdapter);

        var clientStateSendLoop = new ClientStateSendLoop(clientState, communicator);
        var renderLoop = new RenderLoop();

        var sceneGenerator = new ThreejsSceneGenerator($canvas[0]);

        var gameState = new GameState(communicator, sceneGenerator, clientStateSendLoop, renderLoop, input.showInfo);
        communicator.registerMessageHandler(gameState);
    });
}