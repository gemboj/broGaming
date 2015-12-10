function Server(input){
    ServerBase.call(this, input.id, input.usernames, input.createDataChannel);

    var channels = {};
    var channelsLength = input.usernames.length;
    var connected = 0;
};

Server.prototype = Object.create(ServerBase.prototype);
Server.prototype.constructor =
Server;

Server.prototype.prepareScene = function(){
    var scene = {};

    var userAngle = 2*Math.PI/this.playersCount;
    for(var i = 0; i < this.playersCount; ++i){
        var position = {z: 0};
        position.x = Math.cos(userAngle * i);
        position.y = Math.sin(userAngle * i);

        var color = {};
        color.r = ~~(Math.random()*255);
        color.g = ~~(Math.random()*255);
        color.b = ~~(Math.random()*255);

        scene[i] = {
            position: position,
            delta: {
                x: 0,
                y: 0,
                z: 0
            },
            color: color
        }
    }

    return scene;
}

Server.prototype.start = function(){
    var that = this;

    this.scene = this.prepareScene();

    var playerId = 0;
    for(var username in that.dataChannels){
        that.send(username, 'start', {playersCount: that.playersCount, playerId: playerId, sceneData: this.scene});
        playerId++;
    }

    var updateScene = this.updateScene.bind(this);
    setInterval(function(){
        that.updateScene();
    }, 100);
};

Server.prototype.updateScene = function(){
    var scene = this.scene;
    for(var player in scene){
        scene[player].position.x += scene[player].delta.x;
        scene[player].position.y += scene[player].delta.y;
        scene[player].position.z += scene[player].delta.z;
    }

    this.broadcast('update', scene);
}

Server.prototype.updatePlayer = function(data){
    var playerId = data.playerId,
        scene = this.scene;

    scene[playerId].delta.x = data.delta.x;
    scene[playerId].delta.y = data.delta.y;
    scene[playerId].delta.z = data.delta.z;
}