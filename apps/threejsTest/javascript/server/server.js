function main(input){
    var channels = {},
        channelsLength = input.usernames.length;
    var connected = 0;

    for(var i = 0; i < input.usernames.length; ++i){
        var _i = i;
        var channel = input.createDataChannel(input.usernames[_i], input.id);

        registerChannel(channel, input.usernames[i]);
    }

    function registerChannel(channel, username){
        channels[username] = channel;


        channel.registerOnConnect(function(){
            console.log('server connected with ' + username);

            ++connected;
            if(connected === channelsLength){
                startGame(channels, channelsLength);
            }
        });



        channel.registerOnDisconnect(function(){
            delete channels[username];
            --connected;
            console.log(username + ' disconnected');
        });

        channel.registerOnError(function(){
            delete channels[username];
            console.log(username + ' error');
        });
    }

    function prepareServerScene(noOfPlayers){
        var scene = {};

        for(var i = 0; i < noOfPlayers; ++i){
            scene[i] = {
                position: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                delta: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            }
        }

        return scene;
    }

    function startGame(channels, noOfPlayers){
        var scene = prepareServerScene(noOfPlayers);

        var playerNo = 0;
        for(var channel in channels){
            channels[channel].registerOnMessage(function(data){
                var playerNo = data.playerNo;

                scene[playerNo].delta.x = data.delta.x;
                scene[playerNo].delta.y = data.delta.y;
                scene[playerNo].delta.z = data.delta.z;
            });

            channels[channel].send({start: true, noOfPlayers: noOfPlayers, playerNo: playerNo});
            playerNo++;
        }

        setInterval(function(){
            for(var player in scene){
                scene[player].position.x += scene[player].delta.x;
                scene[player].position.y += scene[player].delta.y;
                scene[player].position.z += scene[player].delta.z;
            }

            for(var channel in channels){
                channels[channel].send({scene: scene});
            }
        }, 100);
    }
};
