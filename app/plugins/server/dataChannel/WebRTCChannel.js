function WebRTCChannel(dataChannel){
    EventListener.call(this);
    var that = this;

    that.send = function(user, type, _data){
        var _package = {data: _data, eventType: type};

        dataChannel.send(user, 'webrtc', _package);
    };

    var events = {};

    events['offer'] = that.createEvent('offer', function(action, data, cb){
        action(function(listener){
            var promise = listener(data._sendersUsername, data.receiver, data.description, data.id, data.hostId);

            resolveCallback(promise, cb);
        });
    });

    events['answer'] = that.createEvent('answer', function(action, data, cb){
        action(function(listener){
            var promise = listener(data.receiver, data.description, data.id, data.hostId);

            resolveCallback(promise, cb);
        });
    });

    events['iceCandidate'] = that.createEvent('iceCandidate', function(action, data){
        action(function(listener){
            listener(data.receiver, data.iceCandidate, data.id, data.hostId);
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

    dataChannel.registerEvents('webrtc', events);
}

WebRTCChannel.prototype = Object.create(EventListener);