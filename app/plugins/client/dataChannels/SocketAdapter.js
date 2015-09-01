function SocketAdapter(socketio, address){
    EventListener.call(this);
    var that = this;
    var socket = null;

    var applications = {};
    that.connect = function(credentials){
        socket = socketio.connect(address, { 'force new connection': true, query:  'username=' + credentials.username + '&password=' + credentials.password});

        socket.on('connect', function(){
            connected(credentials.username);

            for(app in applications){
                registerEvent(app, socket)
            }
        });

        socket.on('error', error);
        socket.on('disconnect', disconnectEvent);
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
        that.send = function(type, _package){
            return new Promise(function(resolve, reject){
                socket.emit(type, _package, function(data, error){
                    if(error === undefined){
                        resolve(data);
                    }
                })
            })
        }
    });

    var error = that.createEvent('error', function (action, message) {
        action(function (listener) {
            listener(message);
        });
    });

    var disconnectEvent = that.createEvent('disconnect', function (action, message) {
        action(function (listener) {
            listener(message);
        });
    });

    function registerEvent(name, socket){
        socket.on(name, function(_package){
            applications[name][_package.eventType](_package.data);
        });
    }

    that.registerApplication = function (name, events) {
        if(applications[name] !== undefined) throw name + 'event already exists!';

        applications[name] = events;
    };
}

SocketAdapter.prototype = Object.create(EventListener);