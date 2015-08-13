function DataChannel(socketio, address){
    EventListener.call(this);
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
        that.chat[chatEventNames[i]] = that.createEvent(chatEventNames[i], function(cb, data){
                cb(data);
            },
            that.chat
        );
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

    send = function(type, data, cb){
        error('Not connecter');
    };

    connected = that.createEvent('connected', function(cb, username){
        cb(username);
    });

    that.registerOnConnected(function(){
        send = function(type, data, cb){
            socket.emit(type, data, cb);
        }
    });

    error = that.createEvent('error', function(cb, message){
        cb(message);
    });
}

DataChannel.prototype = Object.create(EventListener);