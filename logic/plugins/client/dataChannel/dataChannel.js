function DataChannel(socketio, address){
    EventListener.call(this);
    var that = this;
    var socketio = socketio;
    var socket = null;
    var address = address;

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

DataChannel.prototype = Object.create(EventListener);