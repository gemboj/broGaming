function SendingMessagesController(scope){
    Controller.call(this, scope);
    var that = this;

    scope.message = '';

    scope.sendMessage = that.createEvent('sendMessage', function(action){
        action(function(listener){
            listener(scope.message);
        });
    });
}