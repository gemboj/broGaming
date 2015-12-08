define([], function (){
var client = {};

client.Client = function(input){
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


return client;
});