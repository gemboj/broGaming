function WebRTCSocket(dataChannel){
    EventListener.call(this);
    var that = this;

    that.send = function(eventType, data){
        var _package = {data: data, eventType: eventType};

        return dataChannel.send('webrtc', _package);
    };

    that.events = {};

    that.events.offer = that.createEvent('offer', function(action, data){
        action(function(listener){
            listener(data.id, data.hostId, data.sender, data.sessionDescription);
        });
    });

    that.events.answer = that.createEvent('answer', function(action, data){
        action(function(listener){
            listener(data.id, data.hostId, data.sessionDescription);
        });
    });

    that.events.iceCandidate = that.createEvent('iceCandidate', function(action, data){
        action(function(listener){
            listener(data.id, data.hostId, data.iceCandidate);
        });
    });

    that.events.error = that.createEvent('error', function(action, data){
        action(function(listener){
            listener(data.sender, data.error);
        });
    });

    dataChannel.registerApplication('webrtc', that.events);
}

WebRTCSocket.prototype = Object.create(EventListener);