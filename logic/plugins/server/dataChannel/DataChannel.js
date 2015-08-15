function DataChannel(socketio){
    EventListener.call(this);
    var that = this;
    that.socketio = socketio;

    that.chat = {};

    socketio.use(function(socket, next){
        var username = socket.handshake.query.username,
            password = socket.handshake.query.password;

            newConnectionEvent({
                username: username, password: password, successCb: function () {
                    next();
                }, failCb: function(err){
                    next(new Error(err));
                }
            });
    });

    var newConnectionEvent = that.createEvent('newConnection', function (action, data) {
        action(function (listener) {
            listener(data).then(function(){
                data.successCb();
            }).catch(function(err){
                data.failCb(err);
            });
        });
    });

    var events = {};

    socketio.sockets.on('connection', function(socket) {
        for(event in events){
            socket.on(event, function(data){
                events[event][data.type](data);
            });
        }
    });

    that.registerEvents = function (eventName, events) {
        if(events[eventName] !== undefined) throw eventName + 'event already exists!';

        events[eventName] = events;
    };
}

DataChannel.prototype = Object.create(EventListener);