function SendingMessagesController(scope){
    Controller.call(this, scope);
    var that = this;

    scope.receiverUsername = '';
    scope.message = '';

    scope.sendMessage = function(){
        if(scope.receiverUsername === ''){
            sendRoomMessage();
        }
        else{
            sendMessage();
        }
        scope.message = '';
    };

    var sendMessage = that.createEvent('sendMessage', function(action){
        action(function(listener){
            listener(scope.receiverUsername, scope.message);
        });
    });

    var sendRoomMessage = that.createEvent('sendRoomMessage', function(action){
        action(function(listener){
            listener(scope._chatStaticData.currentRoom.id, scope.message);
        });
    });
}