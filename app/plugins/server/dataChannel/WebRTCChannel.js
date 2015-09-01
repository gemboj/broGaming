function WebRTCChannel(dataChannel){
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
        events[event] = that.createEvent(event, function (action, data, cb) {
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

    events['sendData'] = that.createEvent('sendData', function(action, data, cb){
        action(function(listener){
            var promise = listener(data.receiver, data._sendersUsername, data.data);

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
                    //cb(null, 'no cb data');
                })
        }
    }

    dataChannel.registerEvents('chat', events);
}

WebRTCChannel.prototype = Object.create(EventListener);