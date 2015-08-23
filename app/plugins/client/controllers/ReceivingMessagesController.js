function ReceivingMessagesController(scope){
    Controller.call(this, scope);
    var that = this;

    scope.messageLog = '';

    var showMessage = function(message){
        scope.messageLog += (message + '\n');
        that.applyChanges();
    };

    that.showLogin = function(username){
        showMessage('Logged as: ' + username);
    };

    that.showError = function(err){
        showMessage('Error: ' + err);
    };
}