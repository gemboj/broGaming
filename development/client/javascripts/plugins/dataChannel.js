define(["/../plugins"], function (plugins){
var dataChannel = {};

dataChannel.ChatChannel = function(dataChannel){
    plugins.EventListener.call(this);
    var that = this;

    var eventsNames = [
        'receiveMessage'
    ];

    that.events = {};
    that.send = function(data, cb){
        dataChannel.send('chat', data, cb);
    };

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
    var socketio = socketio;
    var socket = null;
    var address = address;

/*    var chatEventNames = [
        'receiveMessage'
    ];
    that.chat = {
        send: function(data, cb){
            send('chat', data, cb)
        }
    };

    for(var i = 0; i < chatEventNames.length; ++i){
        that.chat[chatEventNames[i]] = that.createEvent(chatEventNames[i], function (action, data) {
            action(function (listener) {
                listener(data);
            });
        });
    }*/


    var applications = {};
    that.connect = function(credentials){
        socket = socketio.connect(address, { 'force new connection': true, query:  'username=' + credentials.username + '&password=' + credentials.password});

        socket.on('connect', function(){
            connected(credentials.username);
        });

        socket.on('error', error);


        for(app in applications){
            socket.on(app, function(data){
                applications[app][data.eventType](data);
            });
        }
        /*socket.on('chat', function(data){
            that.chat[data.type](data);
        });*/
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
        that.send = function(type, data, cb){
            socket.emit(type, data, cb);
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