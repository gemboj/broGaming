var dataChannel = {};
var plugins = require("./...../plugins");

dataChannel.DataChannel = function(socketio){
    plugins.EventListener.call(this);
    var that = this;
    that.socketio = socketio;

    that.chat = {};

    socketio.use(function(socket, next){//authorization
        var username = socket.handshake.query.username,
            password = socket.handshake.query.password;

        if (username){
            return next();
        }
        next(new Error('Undefined nick'));
    });

    socketio.sockets.on('connection', function(socket) {

    })
}

dataChannel.DataChannel.prototype = Object.create(plugins.EventListener);

module.exports = dataChannel;