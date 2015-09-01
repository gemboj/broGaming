define([], function (){
    var o = {};


    o.client = function(input){//id, $div, $scope, webRTCChannel
        var scope = input.$scope;

        scope.costam = 0;
        scope.cos = function(){
            scope.costam++;
        }

        input.registerOnConnected(function(){
            console.log('connected')
        });
    }

    o.server = function(input){//WebRTCChannel, usernames
        console.log('starting server');
    }

    return o;
});