function DataChannel(socketio){
    EventListener.call(this);
    var that = this;
    that.socketio = socketio;


    var sockets = {};
    socketio.use(function(socket, next){
        var username = socket.handshake.query.username,
            password = socket.handshake.query.password;

            incomingConnectionEvent({
                username: username, password: password,
                successCb: function () {
                    next();
                },
                failCb: function(err){
                    next(new Error(err));
                }
            });
    });


    var applications = {};
    socketio.sockets.on('connection', function(socket) {
        var username = socket.handshake.query.username

        sockets[username] = socket;

        for(event in applications){
            registerEvent(event, socket, username);
        }

        socket.on('disconnect', function () {
            disconnectedEvent(username);
        });

        socket.on('error', function(error){
            console.trace(error);
        })

        newConnectionEvent(username);
    });

    that.registerEvents = function (name, events) {
        if(applications[name] !== undefined) throw name + 'application already exists!';

        applications[name] = events;
    };

    var incomingConnectionEvent = that.createEvent('incomingConnection', function (action, data) {
        action(function (listener) {
            listener(data).then(function(){
                data.successCb();
            }).catch(function(err){
                data.failCb(err);
            });
        });
    });

    var disconnectedEvent = that.createEvent('disconnected', function (action, username) {
        action(function (listener) {
            listener(username);
        });
    });

    var newConnectionEvent = that.createEvent('newConnection', function (action, data) {
        action(function (listener) {
            listener(data);
        });
    });

    function registerEvent(event, socket, username){
        socket.on(event, function(_package, cb){
            var data = _package.data;
            data._sendersUsername = username;
            applications[event][_package.eventType](data, cb);
        });
    }

    that.send = function(username, application, _package){
        var socket = sockets[username];

        socket.emit(application, _package);
    }
}

DataChannel.prototype = Object.create(EventListener);