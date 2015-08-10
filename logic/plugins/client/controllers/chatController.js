function chatController(scope){
    EventListener.call(this);
    var that = this;

    that.scope = scope;

    that.scope.message = '';

    that.scope.sendMessage = that.createEvent('sendMessage', function(cb){
        cb(that.scope.message);
    });
}

chatController.prototype = Object.create(EventListener);