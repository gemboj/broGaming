/*
function Server(input){
    var that = this;

    var usernames = input.usernames,
        createDataChannel = input.createDataChannel,
        id = input.id;

    this.dataChannels = {};
    this.connectedPlayers = 0;
    this.playersCount = usernames.length;

    this.isStarted = false;

    for(var i = 0; i < usernames.length; i++){
        var username = usernames[i],
            dataChannel = createDataChannel(username, id);

        this.dataChannels[username] = dataChannel;
        registerDataChannelEvents(dataChannel, username);
    }

    function registerDataChannelEvents(dataChannel, username){
        dataChannel.registerOnConnect(function(){
            that.connectedPlayers++;
            if(that.connectedPlayers === that.playersCount){
                that.start();
            }
        });

        dataChannel.registerOnDisconnect(function(){
            delete that.dataChannels[username];
            that.connectedPlayers--;

            if(that.isStarted){

            }
        });

        dataChannel.registerOnError(function(){
            delete that.dataChannels[username];
            that.connectedPlayers--;
        });

        dataChannel.registerOnMessage(function(){
            that.receive.apply(that, arguments);
        });
    }
}

Server.prototype.prepareScene = function(){
    var scene = {};

    var userAngle = 2*Math.PI/this.playersCount;
    for(var i = 0; i < this.playersCount; ++i){
        var position = {z: 0};
        position.x = Math.cos(userAngle * i);
        position.y = Math.sin(userAngle * i);

        var color = {};
        color.r = ~~(Math.random()*255);
        color.g = ~~(Math.random()*255);
        color.b = ~~(Math.random()*255);

        scene[i] = {
            position: position,
            delta: {
                x: 0,
                y: 0,
                z: 0
            },
            color: color
        }
    }

    return scene;
}

Server.prototype.start = function(){
    var that = this;

    this.scene = this.prepareScene();

    var playerId = 0;
    for(var username in that.dataChannels){
        that.send(username, 'start', {playersCount: that.playersCount, playerId: playerId, sceneData: this.scene});
        playerId++;
    }

    var updateScene = this.updateScene.bind(this);
    setInterval(function(){
        that.updateScene();
    }, 100);
};

Server.prototype.updateScene = function(){
    var scene = this.scene;
    for(var player in scene){
        scene[player].position.x += scene[player].delta.x;
        scene[player].position.y += scene[player].delta.y;
        scene[player].position.z += scene[player].delta.z;
    }

    this.broadcast('update', scene);
}

Server.prototype.updatePlayer = function(data){
    var playerId = data.playerId,
        scene = this.scene;

    scene[playerId].delta.x = data.delta.x;
    scene[playerId].delta.y = data.delta.y;
    scene[playerId].delta.z = data.delta.z;
}

Server.prototype.broadcast = function(type, data){
    var packet = {type: type, data: data};

    for(var username in this.dataChannels){
        this.dataChannels[username].send(packet);
    }
};

Server.prototype.send = function(username, type, data){
    var packet = {type: type, data: data};

    this.dataChannels[username].send(packet);
};

Server.prototype.receive = function(packet){
    this[packet.type](packet.data);
};*/