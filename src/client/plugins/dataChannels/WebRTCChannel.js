function WebRTCChannel(){
    EventListener.call(this);
    var that = this;
    var lastReceivedMessage = -1;
    var currentMessageId = 0;

    that.connect = that.createEvent('connect', function(action){
        action(function(listener){
            listener();
        });
    });

    that.disconnect = that.createEvent('disconnect', function(action){
        action(function(listener){
            listener();
        });
    });

    that.error = that.createEvent('error', function(action, data){
        action(function(listener){
            listener(data);
        });
    });

    that.message = that.createEvent('message', function(action, eventData){
        action(function(listener){
            var frame = JSON.parse(eventData);
            if(frame.id > lastReceivedMessage){
                lastReceivedMessage = frame.id;
                listener(frame.data);
            }
        });
    });

    that.createSendFunction = function(send){
        that.send = function(data){
            var frame = {
                id: currentMessageId++,
                data: data
            };

            var jsonFrame = JSON.stringify(frame);
            send(jsonFrame);
        };
    };

    that.send = null;
}