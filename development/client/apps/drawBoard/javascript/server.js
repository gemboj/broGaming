define([], function (){
var server = {};

server.Server = function(input){
    var channels = {};

    for(var i = 0; i < input.usernames.length; ++i){
        var _i = i;
        var channel = input.createDataChannel(input.usernames[_i], input.id);

        registerChannel(channel, input.usernames[i]);
    }

    function registerChannel(channel, username){
        channels[username] = channel;

        channel.registerOnConnect(function(){
            input.showInfo('server connected with ' + username);
        });

        channel.registerOnMessage(function(data){
            for(username in channels){
                channels[username].send(data)
            }
        });

        channel.registerOnDisconnect(function(){
            delete channels[username];
            input.showInfo(username + ' disconnected');
        });

        channel.registerOnError(function(){
            delete channels[username];
            input.showInfo('could not connect with ' + username);
        })
    }
};


return server;
});