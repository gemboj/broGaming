define([], function(){
    var o = {};

    o.client = function(input){//id, $div, $scope, webRTCChannel
        var scope = input.$scope;

        scope.costam = 0;
        scope.cos = function(){
            scope.costam++;
        };

        var webRTCChannel = input.webRTCChannel;
        webRTCChannel.registerOnConnect(function(){
            console.log('client connected');
            scope.cos = function(){
                var temp = scope.costam;
                temp++;
                webRTCChannel.send({costam: temp});
            };
        });

        webRTCChannel.registerOnMessage(function(data){
            scope.costam = data.costam;
            scope.$apply();
        });
    };

    o.server = function(input){//createDataChannel, usernames, id
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
    }

    return o;
});