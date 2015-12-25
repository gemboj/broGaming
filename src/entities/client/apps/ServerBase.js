function ServerBase(id, usernames, createDataChannel){
    var that = this;

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

ServerBase.prototype.broadcast = function(type, data){
    var packet = {type: type, data: data};

    for(var username in this.dataChannels){
        this.dataChannels[username].send(packet);
    }
};

ServerBase.prototype.send = function(username, type, data){
    var packet = {type: type, data: data};

    this.dataChannels[username].send(packet);
};

ServerBase.prototype.receive = function(packet){
    this[packet.type](packet.data);
};

ServerBase.prototype.start = function(){
    throw "start method not implemented";
};