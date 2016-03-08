function WebRTCChannel(){
    EventListener.call(this);
    var that = this;

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

    that.message = that.createEvent('message', function(action, eventData){
        action(function(listener){
            var data = JSON.parse(eventData);
            listener(data);
        });
    });
    
    that.error = that.createEvent('error', function(action, data){
        action(function(listener){
            listener(data);
        });
    });

    that.createSendFunction = function(send){
        that.send = function(data){
            var string = JSON.stringify(data);
            send(string);
        };
    };

    that.send = null;
}