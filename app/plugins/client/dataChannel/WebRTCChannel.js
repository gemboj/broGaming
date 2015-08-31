function WebRTCChannel(){
    EventListener.call(this);
    var that = this;

    that.connected = that.createEvent('connected', function(action){
        action(function(listener){
            listener();
        });
    });

    that.disconnected = that.createEvent('disconnected', function(action){
        action(function(listener){
            listener();
        });
    });

    that.receivedMessage = that.createEvent('receivedMessage', function(action){
        action(function(listener){
            listener();
        });
    });

    this.send = function(){

    }
}