define([], function(){
    var o = {};

    o.client = function(input){//id, $div, $scope, webRTCChannel
        var scope = input.$scope;

        var $canvas = input.$div.find('canvas'),
            canvas = $canvas[0],
            context = canvas.getContext("2d");

        canvas.onmousedown  = function(event){
            mouseDown(event);
        };

        canvas.onmousemove  = function(event){
            mouseMove(event);
        };

        canvas.onmouseup  = function(event){
            mouseUp(event);
        };

        var webRTCChannel = input.webRTCChannel;
        webRTCChannel.registerOnConnect(function(){
            console.log('client connected');
            mouseMove = mouseMoveOnline;
        });

        var isMouseDown = false;
        webRTCChannel.registerOnMessage(function(data){
            drawPoint(data.x, data.y, data.radius, data.color);
        });

        var mouseDownOffline = function(event){
            isMouseDown = true;
        };

        var mouseMoveOffline = function(event){
            if(isMouseDown){
                var coord = getXY(event);
                drawPoint(coord.x, coord.y, 2, '#FF0000');
            }
        };

        var mouseMoveOnline = function(event){
            if(isMouseDown){
                var coord = getXY(event);
                webRTCChannel.send({x: coord.x, y: coord.y, radius: 2, color: '#FF0000'});
            }
        };

        var mouseUpOffline = function(event){
            isMouseDown = false;
        };

        var mouseDown = mouseDownOffline;
        var mouseMove = mouseMoveOffline;
        var mouseUp = mouseUpOffline;



        function drawPoint(x, y, radius, color){
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI, false);
            context.fillStyle = color;
            context.fill();
        }

        function getXY(event){
            //var parentOffset = $canvas.parent().offset(),
                var x = event.offsetX,// - event.offsetX,
                y = event.offsetY;// - event.offsetY;

            return {x: x, y: y};
        }
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