function Server(input){
    this.channels = {};

    this.createDataChannel = input.createDataChannel;
    this.id = input.id;
    this.showInfo = input.showInfo;

    for(var i = 0; i < input.usernames.length; ++i){
        var _i = i;
        var channel = input.createDataChannel(input.usernames[_i], input.id);

        this.registerChannel(channel, input.usernames[i]);
    }

}

Server.prototype.registerChannel = function(channel, username){
    var that = this;

    this.channels[username] = channel;

    channel.registerOnConnect(function(){
        that.showInfo('server connected with ' + username);
    });

    channel.registerOnMessage(function(data){
        for(username in that.channels){
            that.channels[username].send(data)
        }
    });

    channel.registerOnDisconnect(function(){
        delete that.channels[username];
        //that.showInfo(username + ' disconnected');
    });

    channel.registerOnError(function(){
        delete that.channels[username];
        that.showInfo('could not connect with ' + username);
    })
};

Server.prototype.userJoined = function(username){
    this.registerChannel(this.createDataChannel(username, this.id), username);
};

Server.prototype.close = function(){
    for(var channelIndex in this.channels){
        var channel = this.channels[channelIndex];

        channel.close();

        delete this.channels[channelIndex];
    }
};