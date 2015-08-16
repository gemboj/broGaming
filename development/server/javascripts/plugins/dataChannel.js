var dataChannel = {};
var plugins = require("./../plugins");

dataChannel.ChatChannel = function(dataChannel){
    plugins.EventListener.call(this);
    var that = this;

    var eventsNames = [
        'privateMessage'
    ];

    that.send = function(user, type, _data){
        var data = _data;
        data.eventType = type;

        dataChannel.send(user, 'chat', data);
    };

    var events = {};
    eventsNames.forEach(function(event){
        events[event] = that.createEvent(event, function (action, data) {
            action(function (listener) {
                listener(data);
            });
        });
    });

    dataChannel.registerEvents('chat', events);
}

dataChannel.ChatChannel.prototype = Object.create(plugins.EventListener);
dataChannel.DataChannel = function(socketio){
    plugins.EventListener.call(this);
    var that = this;
    that.socketio = socketio;


    var sockets = {};
    socketio.use(function(socket, next){
        var username = socket.handshake.query.username,
            password = socket.handshake.query.password;

            incomingConnectionEvent({
                username: username, password: password, successCb: function () {
                    next();
                }, failCb: function(err){
                    next(new Error(err));
                }
            });
    });


    var applications = {};
    socketio.sockets.on('connection', function(socket) {
        var username = socket.handshake.query.username
        newConnectionEvent(username);
        sockets[username] = socket;
        for(event in applications){
            socket.on(event, function(_data){
                var data = _data;
                data.sendersUsername = username;
                applications[event][data.type](data);
            });
        }
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

    var newConnectionEvent = that.createEvent('newConnection', function (action, data) {
        action(function (listener) {
            listener(data);
        });
    });

    that.send = function(user, application, data){
        var username = user.getUsername();
        var socket = sockets[username];

        socket.emit(application, data);
    }
}

dataChannel.DataChannel.prototype = Object.create(plugins.EventListener);

module.exports = dataChannel;