define(['threeJs'], function(THREE){
    var o = {};

    function prepareClientScene(canvas, noOfPlayers){
        var scene = new THREE.Scene();
        var players = {};
        for(var i = 0; i < noOfPlayers; ++i){
            var geometry = new THREE.BoxGeometry( 1, 1, 1 );
            var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
            var cube = new THREE.Mesh( geometry, material );
            scene.add( cube );
            players[i] = cube;
        }

        var camera = new THREE.PerspectiveCamera( 75, 200/200, 0.1, 1000 );


        var renderer = new THREE.WebGLRenderer({ canvas: canvas });
        renderer.setSize( 200, 200);

        /*var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
        var cube = new THREE.Mesh( geometry, material );
        scene.add( cube );*/

        camera.position.z = 5;

        var pointLight = new THREE.PointLight( 0xFFFFFF, 5, 10 );
        pointLight.position.set( 5, 5, 5 );
        scene.add(pointLight);

        var light = new THREE.AmbientLight( 0x404040 );
        scene.add( light );

        /*var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
         directionalLight.position.set( 0, 1, 1 );
         scene.add( directionalLight );*/

        var render = function () {
            requestAnimationFrame( render );

            /*cube.position.x += 0.02 * horizontal;
            cube.position.y += 0.02 * vertical;*/

            renderer.render(scene, camera);
        };

        render();

        return players;
    }

    o.client = function(input){//id, $div, $scope, webRTCChannel
        var scope = input.$scope;

        scope.cos = 1;
        var $canvas = input.$div.find('canvas'),
            canvas = $canvas[0];

        var delta = {
            x: 0,
            y: 0,
            z: 0
        };
        $canvas.keydown(function(e){
            if ( e.keyCode == 87 ) {
                delta.y = 1
            }

            if ( e.keyCode == 83 ) {
                delta.y = -1
            }

            if ( e.keyCode == 65 ) {
                delta.x = -1;
            }

            if ( e.keyCode == 68 ) {
                delta.x = 1;
            }
        });

        $canvas.keyup(function(e){
            if ( e.keyCode == 87 ) {
                delta.y = 0;
            }

            if ( e.keyCode == 83 ) {
                delta.y = 0
            }

            if ( e.keyCode == 65 ) {
                delta.x = 0;
            }

            if ( e.keyCode == 68 ) {
                delta.x = 0;
            }
        });

        var webRTCChannel = input.webRTCChannel;
        webRTCChannel.registerOnConnect(function(){
            input.showInfo('connected with server');
        });

        var players = null,
            playerNo = null;
        webRTCChannel.registerOnMessage(function(data){
            if(data.start !== true && players){

            }
            else{
                players = prepareClientScene(canvas, data.noOfPlayers);
            }
        });
    };

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
    }

    function startGame(channels){
        var scene = prepareServerScene(channels.length);

        for(var channel in channels){
            channel.registerOnMessage(function(data){
                var playerNo = data.playerNo;

                scene[playerNo].delta.x = data.delta.x;
                scene[playerNo].delta.y = data.delta.y;
                scene[playerNo].delta.z = data.delta.z;
            });

            channels[channel].send({start: true, noOfPlayers: channels.length, playerNo: channel});
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

    o.server = function(input){//createDataChannel, usernames, id
        var channels = {};

        for(var i = 0; i < input.usernames.length; ++i){
            var _i = i;
            var channel = input.createDataChannel(input.usernames[_i], input.id);

            registerChannel(channel, input.usernames[i]);
        }

        function registerChannel(channel, username){
            channels[username] = channel;
            var connected = 0;

            channel.registerOnConnect(function(){
                console.log('server connected with ' + username);

                ++connected;
                if(connected === channels.length){
                    startGame(channels);
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
    }

    return o;
});