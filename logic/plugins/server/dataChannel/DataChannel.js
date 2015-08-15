function DataChannel(socketio){
    EventListener.call(this);
    var that = this;
    that.socketio = socketio;

    that.chat = {};

    socketio.use(function(socket, next){
        var username = socket.handshake.query.username,
            password = socket.handshake.query.password;


            newConnection({
                username: username, password: password, successCb: function () {
                    next();
                }, failCb: function(err){
                    next(new Error(err));
                }
            });
    });

    var newConnection = that.createEvent('newConnection', function (action, data) {
        action(function (listener) {
            listener(data).then(function(){
                data.successCb();
            }).catch(function(err){
                data.failCb(err);
            });
        });
    });

    socketio.sockets.on('connection', function(socket) {

    })
}

DataChannel.prototype = Object.create(EventListener);