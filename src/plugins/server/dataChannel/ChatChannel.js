function ChatChannel(dataChannel){
    EventListener.call(this);
    var that = this;

    that.send = function(user, type, _data){
        var _package = {data: _data, eventType: type};

        dataChannel.send(user, 'chat', _package);
    };

    var events = {};
    events['createRoom'] = that.createEvent('createRoom', function(action, data, cb){
        action(function(listener){
            var promise = listener(data.roomName, data._sendersUsername);

            resolveCallback(promise, cb);
        });
    });

    events['joinRoom'] = that.createEvent('joinRoom', function(action, data, cb){
        action(function(listener){
            var promise = listener(data._sendersUsername, data.roomId);

            resolveCallback(promise, cb);
        });
    });

    events['leaveRoom'] = that.createEvent('leaveRoom', function(action, data, cb){
        action(function(listener){
            var promise = listener(data._sendersUsername, data.roomId);

            resolveCallback(promise, cb);
        });
    });

    events['roomMessage'] = that.createEvent('sendRoomMessage', function(action, data, cb){
        action(function(listener){
            var promise = listener(data.roomId, data._sendersUsername, data.message);

            resolveCallback(promise, cb);
        });
    });

    events['sendData'] = that.createEvent('sendData', function(action, data, cb){
        action(function(listener){
            var promise = listener(data.receiver, data._sendersUsername, data.data);

            resolveCallback(promise, cb);
        });
    });


    events['roomInvite'] = that.createEvent('roomInvite', function(action, data, cb){
        action(function(listener){
            var promise = listener(data._sendersUsername, data.receiver, data.roomId, data.app);

            resolveCallback(promise, cb);
        });
    });

    events['privateMessage'] = that.createEvent('privateMessage', function(action, data, cb){
        action(function(listener){
            var promise = listener(data._sendersUsername, data.receiver, data.message);

            resolveCallback(promise, cb);
        });
    });
    

    function resolveCallback(promise, cb){
        if(promise !== undefined){
            promise
                .then(function(data){
                    if(data !== undefined){
                        cb(data);
                    }
                })
                .catch(function(err){
                    cb(null, err);
                })
        }
    }

    dataChannel.registerEvents('chat', events);
}

ChatChannel.prototype = Object.create(EventListener);