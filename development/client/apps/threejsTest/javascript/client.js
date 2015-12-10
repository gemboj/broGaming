define(["threeJs","/../../../javascripts/entities/apps.js"], function (THREE,apps){
var client = {};

client.Client = function(input){
    apps.ClientBase.call(this, input.webRTCChannel);

    var that = this;
    var scope = input.$scope;


    input.$div.ready(function(){
        var $canvas = input.$div.find('canvas');
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


    this.delta = {
        x: 0,
        y: 0,
        z: 0
    };


    this.webRTCChannel = input.webRTCChannel;
    this.webRTCChannel.registerOnConnect(function(){
        input.showInfo('connected with server');
    });

    this.players = null;
    this.playerNo = null;
    this.noOfPlayers = null;
};

client.Client.prototype = Object.create(apps.ClientBase.prototype);
client.Client.prototype.constructor =
client.Client;

client.Client.prototype.update = function(scene){
    for(var i = 0; i < this.noOfPlayers; ++i){
        this.players[i].position.x = scene[i].position.x;
        this.players[i].position.y = scene[i].position.y;
        this.players[i].position.z = scene[i].position.z;
    }
};

client.Client.prototype.start = function(data){
    var that = this;

    this.players = this.prepareScene(this.canvas, data.noOfPlayers);
    this.noOfPlayers = data.noOfPlayers;
    this.playerNo = data.playerNo;

    setInterval(function(){
        that.send('updatePlayer', {delta: that.delta, playerNo: that.playerNo});
    }, 100);
};

client.Client.prototype.prepareScene = function(canvas, noOfPlayers){
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

return client;
});