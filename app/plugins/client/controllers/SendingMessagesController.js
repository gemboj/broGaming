function SendingMessagesController(scope){
    Controller.call(this, scope);
    var that = this;

    scope.message = '';

    scope.sendMessage = that.createEvent('sendMessage', function(action){
        action(function(listener){
            listener(scope._chatStaticData.currentRoom.id, 'roomMessage', {roomName: scope._chatStaticData.currentRoom.name, message: scope.message, sender: scope._chatStaticData.currentUser.username});
        });
    });
}