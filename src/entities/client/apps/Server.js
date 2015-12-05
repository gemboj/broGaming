function Server(id, usernames, createDataChannel){
    var that = this;

    this.dataChannels = {};
    this.connectedPlayers = 0;
    this.numberOfPlayers = usernames.length;

    this.isStarted = false;

    for(var i = 0; i < usernames.length; i++){
        var username = usernames[i],
            channel = createDataChannel(username, id);

        this.dataChannels[username] = dataChannel;
        registerDataChannelEvents(channel, username);
    }

    function registerDataChannelEvents(dataChannel, username){
        dataChannel.registerOnConnect(function(){
            that.connectedPlayers++;
            if(that.connectedPlayers === that.numberOfPlayers){
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

        dataChannel.registerOnMessage(this.receive);
    }
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
};

Server.prototype.start = function(){

};