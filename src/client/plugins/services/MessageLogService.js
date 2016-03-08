function MessageLogService(scope){
    Service.call(this, scope);
    var that = this;

    that.messageLog = '';

    this.getMessageLog = function(){
        return that.messageLog;
    }

    var showMessage = function(message){
        that.messageLog += (message + '\n');
        that.applyChanges();
    };

    that.showLogin = function(username){
        showMessage('Logged as: ' + username);
    };

    that.showError = function(err){
        showMessage('Error: ' + err);
    };

    that.showRoomMessage = function(sender, roomName, message){
        showMessage(sender + " [" + roomName + "] :" + message);
    };

    that.showMessage = function(sender, message){
        showMessage(sender + " :" + message);
    };

    that.showInfo = function(info){
        showMessage(info);
    }
}