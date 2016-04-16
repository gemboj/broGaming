/*
function Client(input){
    this.webRTCChannel = input.webRTCChannel;

    this.hookGuiEvents(input.$div);
    this.initializeUserInput();
    this.hookDataChannelEvents(input.showInfo);

    var that = this;

    this.isStarted = false;
    this.playerNumber = null;

     //dataChannel.registerOnConnect(function(){});

     //dataChannel.registerOnDisconnect(function(){});

     //dataChannel.registerOnError(function(){});

    this.webRTCChannel.registerOnMessage(function(){
        that.receive.apply(that, arguments);
    });
}

Client.prototype.hookGuiEvents = function($div){
    var that = this;

    $div.ready(function(){
        var $canvas = $div.find('canvas');
        that.canvas = $canvas[0];

        that.canvas.onkeydown = function(e){
            if ( e.keyCode == 87 ) {
                that.delta.y = 1
            }

            if ( e.keyCode == 83 ) {
                that.delta.y = -1
            }

            if ( e.keyCode == 65 ) {
                that.delta.x = -1;
            }

            if ( e.keyCode == 68 ) {
                that.delta.x = 1;
            }
        };

        that.canvas.onkeyup = function(e){
            if ( e.keyCode == 87 ) {
                that.delta.y = 0;
            }

            if ( e.keyCode == 83 ) {
                that.delta.y = 0
            }

            if ( e.keyCode == 65 ) {
                that.delta.x = 0;
            }

            if ( e.keyCode == 68 ) {
                that.delta.x = 0;
            }
        };
    });
};

Client.prototype.initializeUserInput = function(){
    this.delta = {
        x: 0,
        y: 0,
        z: 0
    };
};

Client.prototype.hookDataChannelEvents = function(showInfo){
    this.webRTCChannel.registerOnConnect(function(){
        showInfo('connected with server');
    });
};

Client.prototype.updateScene = function(scene){
    for(var i in this.players){
        this.players[i].update(scene.players[i].position);
    }
};

Client.prototype.start = function(data){
    var that = this;

    this.players = this.prepareScene(this.canvas, data.playersCount, data.sceneData);
    this.playersCount = data.playersCount;
    this.playerId = data.playerId;

    setInterval(function(){
        that.send('updatePlayer', {delta: that.delta, playerId: that.playerId});
    }, 100);
};

Client.prototype.prepareScene = function(canvas, playersCount, sceneData){
    var scene = new THREE.Scene();
    var players = {};
    for(var i in sceneData){
        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshPhongMaterial( { color: "rgb(" + sceneData[i].color.r + "," + sceneData[i].color.g + "," + sceneData[i].color.b + ")" } );
        var cube = new THREE.Mesh( geometry, material );
        cube.translateX(sceneData[i].position.x);
        cube.translateY(sceneData[i].position.y);
        cube.translateZ(sceneData[i].position.z);

        scene.add( cube );
        players[i] = new Player({id: i,object3d: cube});
    }

    var camera = new THREE.PerspectiveCamera( 75, 200/200, 0.1, 1000 );


    var renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize( 200, 200);

    camera.position.z = 5;

    var pointLight = new THREE.PointLight( 0xFFFFFF, 5, 10 );
    pointLight.position.set( 5, 5, 5 );
    scene.add(pointLight);

    var light = new THREE.AmbientLight( 0x404040 );
    scene.add( light );

    var render = function () {
        requestAnimationFrame( render );

        renderer.render(scene, camera);
    };

    render();

    return players;
};

Client.prototype.send = function(type, data){
    var packet = {type: type, data: data};

    this.webRTCChannel.send(packet);
};

Client.prototype.receive = function(packet){
    this[packet.type](packet.data);
};
*/