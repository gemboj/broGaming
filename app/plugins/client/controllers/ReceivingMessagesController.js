function ReceivingMessagesController(scope){
    Controller.call(this, scope);
    var that = this;

    scope.messageLog = 'dgfdgdgfdg';

    var showMessage = function(message){
        scope.messageLog += message;
        that.applyChanges();
    };

    that.showLogin = function(username){
        showMessage('Logged as: ' + username);
    }

    that.showError = function(err){
        showMessage('Error: ' + err);
    }
}