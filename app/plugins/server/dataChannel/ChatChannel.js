function ChatChannel(dataChannel){
    EventListener.call(this);
    var that = this;

    var eventsNames = [
        'privateMessage'
    ];

    that.send = function(user, type, _data){
        var _package = {data: _data, eventType: type};

        dataChannel.send(user, 'chat', _package);
    };

    var events = {};
    eventsNames.forEach(function(event){
        events[event] = that.createEvent(event, function (action, data) {
            action(function (listener) {
                var promise = listener(data);

                if(promise !== undefined){
                    promise
                        .then(function(data){
                            if(data !== undefined){
                                cb(data);
                            }
                        })
                }
            });
        });
    });

    events['createRoom'] = that.createEvent('createRoom', function(action, data, cb){
        action(function(listener){
            var promise = listener(data.roomName, data._sendersUsername);

            resolveCallback(promise, cb);
        });
    });

    events['leaveRoom'] = that.createEvent('leaveRoom', function(action, data, cb){
        action(function(listener){
            var promise = listener(data._sendersUsername, data.roomId);

            resolveCallback(promise, cb);
        });
    });

    events['sendRoomData'] = that.createEvent('sendRoomData', function(action, data, cb){
        action(function(listener){
            var promise = listener(data.roomId, data._sendersUsername, data.data);

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
                .catch(function(){
                    cb(null, 'error');
                })
        }
    }

    dataChannel.registerEvents('chat', events);
}

ChatChannel.prototype = Object.create(EventListener);