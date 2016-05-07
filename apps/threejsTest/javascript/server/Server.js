function Server(input){
    var that = this;

    var usernames = input.usernames;

    this.id = input.id;
    this.createDataChannel = input.createDataChannel;
    this.showInfo = input.showInfo;

    var dataChannels = this.createDataChannels(usernames);

    this.communicator = new Communicator(dataChannels);

    this.scene = new Scene();


    var userAngle = 2*Math.PI/usernames.length;
    for(var i = 0; i < usernames.length; i++){
        this.scene.addPlayer(new ServerPlayer(usernames[i], [Math.cos(userAngle * i), Math.sin(userAngle * i), 0]));
    }

    this.scene.addObject(new GameObject("object1", [0, 0, 0]));

    this.mainLoop = new MainLoop(this.scene, this.communicator.broadcast.bind(this.communicator), 50);


    this.gameState = new GameState(usernames, this.communicator, this.mainLoop, this.scene, this.showInfo);
}

Server.prototype.createDataChannels = function(usernames){
    var dataChannels = {};
    for(var i = 0; i < usernames.length; i++){
        var username = usernames[i],
            dataChannel = this.createDataChannel(username, this.id);

        dataChannels[username] = dataChannel;
    }

    return dataChannels;
};

Server.prototype.userJoined = function(username){
    if(this.gameState.hasPlayerDisconnected(username)){
        var dataChannel = this.createDataChannel(username, this.id);
        this.communicator.addDataChannel(username, dataChannel);
    }
};