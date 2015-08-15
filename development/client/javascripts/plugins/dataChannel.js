define(["/../plugins"], function (plugins){
var dataChannel = {};

dataChannel.DataChannel = function(socketio, address){
    plugins.EventListener.call(this);
    var that = this;
    var socketio = socketio;
    var socket = null;
    var address = address;

    var chatEventNames = [
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
    }

    that.connect = function(credentials){
        socket = socketio.connect(address, { 'force new connection': true, query:  'username=' + credentials.username + '&password=' + credentials.password});

        socket.on('connect', function(){
            connected(credentials.username);
        });

        socket.on('error', error);

        socket.on('chat', function(data){
            that.chat[data.type](data);
        });
    };

    var send = function(type, data, cb){
        error('Not connecter');
    };

    var connected = that.createEvent('connected', function (action, username) {
        action(function (listener) {
            listener(username);
        });
    });

    that.registerOnConnected(function(){
        send = function(type, data, cb){
            socket.emit(type, data, cb);
        }
    });

    var error = that.createEvent('error', function (action, message) {
        action(function (listener) {
            listener(message);
        });
    });
}

dataChannel.DataChannel.prototype = Object.create(plugins.EventListener);

return dataChannel;
});