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

    that.message = that.createEvent('message', function(action, data){
        action(function(listener){
            listener(data);
        });
    });

    this.send = null;
}