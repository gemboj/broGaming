function main(input){
    var channels = {};

    for(var i = 0; i < input.usernames.length; ++i){
        var _i = i;
        var channel = input.createDataChannel(input.usernames[_i], input.id);

        registerChannel(channel, input.usernames[i]);
    }

    function registerChannel(channel, username){
        channels[username] = channel;

        channel.registerOnConnect(function(){
            console.log('server connected with ' + username);
        });

        channel.registerOnMessage(function(data){
            for(username in channels){
                channels[username].send(data)
            }
        });

        channel.registerOnDisconnect(function(){
            delete channels[username];
            console.log(username + ' disconnected');
        });
    }
};
