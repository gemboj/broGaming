define(["/../plugins"], function (plugins){
var dataChannel = {};

dataChannel.ChatChannel = function(dataChannel){
    plugins.EventListener.call(this);
    var that = this;

    var eventsNames = [
        'receiveMessage',
        'roomUsers'
    ];

    that.send = function(eventType, data, cb){
        var _package = {data: data, eventType: eventType};
        dataChannel.send('chat', _package, cb);
    };

    that.events = {};
    for(var i = 0; i < eventsNames.length; ++i){
        that.events[eventsNames[i]] = that.createEvent(eventsNames[i], function (action, data) {
            action(function (listener) {
                listener(data);
            });
        });
    }

    dataChannel.registerApplication('chat', that.events);
}

dataChannel.ChatChannel.prototype = Object.create(plugins.EventListener);
dataChannel.DataChannel = function(socketio, address){
    plugins.EventListener.call(this);
    var that = this;
    var socket = null;

    var applications = {};
    that.connect = function(credentials){
        socket = socketio.connect(address, { 'force new connection': true, query:  'username=' + credentials.username + '&password=' + credentials.password});

        socket.on('connect', function(){
            connected(credentials.username);

            for(app in applications){
                socket.on(app, function(_package){
                    applications[app][_package.eventType](_package.data);
                });
            }
        });

        socket.on('error', error);
        socket.on('disconnect', error);
        socket.on('reconnect', function () {
            error('Reconnected');
        });
        socket.on('reconnecting', function (err) {
            error('Trying to reconnect...');
        });
    };

    that.send = function(type, data, cb){
        error('Not connected');
    };

    var connected = that.createEvent('connected', function (action, username) {
        action(function (listener) {
            listener(username);
        });
    });

    that.registerOnConnected(function(){
        that.send = function(type, _package, cb){
            socket.emit(type, _package, cb);
        }
    });

    var error = that.createEvent('error', function (action, message) {
        action(function (listener) {
            listener(message);
        });
    });

    that.registerApplication = function (name, events) {
        if(applications[name] !== undefined) throw name + 'event already exists!';

        applications[name] = events;
    };
}

dataChannel.DataChannel.prototype = Object.create(plugins.EventListener);

return dataChannel;
});