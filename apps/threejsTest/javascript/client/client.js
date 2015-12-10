function Client(input){
    ClientBase.call(this, input.webRTCChannel);

    this.webRTCChannel = input.webRTCChannel;

    this.hookGuiEvents(input.$div);
    this.initializeUserInput();
    this.hookDataChannelEvents(input.showInfo);
};

Client.prototype = Object.create(ClientBase.prototype);
Client.prototype.constructor =
Client;

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
}

Client.prototype.update = function(scene){
    for(var i = 0; i < this.playersCount; ++i){
        this.players[i].position.x = scene[i].position.x;
        this.players[i].position.y = scene[i].position.y;
        this.players[i].position.z = scene[i].position.z;
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
    for(var i = 0; i < playersCount; ++i){
        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshPhongMaterial( { color: "rgb(" + sceneData[i].color.r + "," + sceneData[i].color.g + "," + sceneData[i].color.b + ")" } );
        var cube = new THREE.Mesh( geometry, material );
        cube.translateX(sceneData[i].position.x);
        cube.translateY(sceneData[i].position.y);
        cube.translateZ(sceneData[i].position.z);

        scene.add( cube );
        players[i] = cube;
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