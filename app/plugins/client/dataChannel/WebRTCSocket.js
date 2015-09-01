function WebRTCSocket(dataChannel){
    EventListener.call(this);
    var that = this;

    that.send = function(eventType, data){
        var _package = {data: data, eventType: eventType};

        return dataChannel.send('webrtc', _package);
    };

    that.events = {};



    dataChannel.registerApplication('webrtc', that.events);
}

WebRTCSocket.prototype = Object.create(EventListener);