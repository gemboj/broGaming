function Server(input){
    ServerBase.call(this, input.id, input.usernames, input.createDataChannel);

    var channels = {};
    var channelsLength = input.usernames.length;
    var connected = 0;

    /*for(var i = 0; i < input.usernames.length; ++i){
        var _i = i;
        var channel = input.createDataChannel(input.usernames[_i], input.id);

        registerChannel(channel, input.usernames[i]);
    }*/

    /*function registerChannel(channel, username){
        channels[username] = channel;


        channel.registerOnConnect(function(){
            console.log('server connected with ' + username);

            ++connected;
            if(connected === channelsLength){
                startGame(channels, channelsLength);
            }
        });



        channel.registerOnDisconnect(function(){
            delete channels[username];
            --connected;
            console.log(username + ' disconnected');
        });

        channel.registerOnError(function(){
            delete channels[username];
            console.log(username + ' error');
        });
    }*/


};

Server.prototype = Object.create(ServerBase.prototype);
Server.prototype.constructor =
Server;

Server.prototype.prepareScene = function(){
    var scene = {};

    for(var i = 0; i < this.numberOfPlayers; ++i){
        scene[i] = {
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            delta: {
                x: 0,
                y: 0,
                z: 0
            }
        }
    }

    return scene;
}

Server.prototype.start = function(){
    var that = this;

    this.scene = this.prepareScene();

    var playerNo = 0;
    for(var username in that.dataChannels){
        that.send(username, 'start', {noOfPlayers: that.numberOfPlayers, playerNo: playerNo});
        playerNo++;
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
    var playerNo = data.playerNo,
        scene = this.scene;

    scene[playerNo].delta.x = data.delta.x;
    scene[playerNo].delta.y = data.delta.y;
    scene[playerNo].delta.z = data.delta.z;
}