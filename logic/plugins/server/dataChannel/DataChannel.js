function DataChannel(socketio){
    EventListener.call(this);
    var that = this;
    that.socketio = socketio;

    that.chat = {};

    socketio.use(function(socket, next){
        var username = socket.handshake.query.username,
            password = socket.handshake.query.password;

        try {
            newConnection({
                username: username, password: password, successCb: function () {
                    next();
                }
            });
        }
        catch(e){
            next(new Error(e));
        }
    });

    var newConnection = that.createEvent('newConnection', function(cb, data){
        cb(data);
    });

    socketio.sockets.on('connection', function(socket) {

    })
}

DataChannel.prototype = Object.create(EventListener);