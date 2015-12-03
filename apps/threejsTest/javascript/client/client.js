function main(input){
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
        playerNo = null,
        noOfPlayers = null;
    webRTCChannel.registerOnMessage(function(data){
        if(data.start !== true && players){
            for(var i = 0; i < noOfPlayers; ++i){
                players[i].position.x = data.scene[i].position.x;
                players[i].position.y = data.scene[i].position.y;
                players[i].position.z = data.scene[i].position.z;
            }
        }
        else{
            players = prepareClientScene(canvas, data.noOfPlayers);
            noOfPlayers = data.noOfPlayers;
            playerNo = data.playerNo;

            setInterval(function(){
                webRTCChannel.send({delta: delta, playerNo: playerNo});
            }, 100);
        }
    });

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
};
