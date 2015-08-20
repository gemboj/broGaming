function ReceivingMessagesController(scope){
    Controller.call(this, scope);
    var that = this;

    scope.messageLog = 'dgfdgdgfdg';

    that.showMessage = function(message){
        scope.messageLog += message;
        this.applyChanges();
    };
}