define([], function (){
    var o = {};


    o.client = function(input){//id, $div, $scope, webRTCChannel
        var scope = input.$scope;

        scope.costam = 0;
        scope.cos = function(){
            scope.costam++;
        }

        var webRTCChannel = input.webRTCChannel;
        webRTCChannel.registerOnConnected(function(){
            console.log('client connected');
        });
    }

    o.server = function(input){//createDataChannel, usernames, id
        var channels = {};
        for(var i = 0; i < input.usernames.length; ++i){
            var channel = input.createDataChannel(input.usernames[i], input.id);

            channel.registerOnConnected(function(){
                console.log('server connected with ' + input.usernames[i]);
            })

            channels[input.usernames[i]] = channel;
        }

        console.log('starting server');
    }

    return o;
});