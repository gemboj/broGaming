function Server(input){
    var that = this;

    var usernames = input.usernames,
        createDataChannel = input.createDataChannel,
        id = input.id;

    //this.connectedPlayers = 0;
    //this.playersCount = usernames.length;

    var dataChannels = this.createDataChannels(usernames, id, createDataChannel);

    this.communicator = new Communicator(dataChannels);

    this.scene = new Scene();

    for(var i = 0; i < usernames.length; i++){
        this.scene.addPlayer(new ServerPlayer(usernames[i], [0, 0, 0]));
    }

    this.mainLoop = new MainLoop(this.scene, this.communicator.broadcast.bind(this.communicator), 50);


    this.gameState = new GameState(usernames, this.communicator, this.mainLoop, this.scene);
}

Server.prototype.createDataChannels = function(usernames, id, createDataChannel){
    var dataChannels = {};
    for(var i = 0; i < usernames.length; i++){
        var username = usernames[i],
            dataChannel = createDataChannel(username, id);

        dataChannels[username] = dataChannel;
    }

    return dataChannels;
}