function Server(input){
    var that = this;

    var usernames = input.usernames,
        createDataChannel = input.createDataChannel,
        id = input.id;

    this.connectedPlayers = 0;
    this.playersCount = usernames.length;

    this.isStarted = false;

    var dataChannels = this.createDataChannels(usernames, id, createDataChannel);

    this.communicator = new Communicator(dataChannels, {});

    this.gameState = new GameState();

    this.mainLoop = new MainLoop()
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