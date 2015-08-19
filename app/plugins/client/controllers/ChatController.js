function ChatController(scope){
    EventListener.call(this);
    var that = this;

    scope.message = 'gemboj';
    scope.login = '';
    scope.error = '';
    scope.messageLog = '';

    scope.sendMessage = that.createEvent('sendMessage', function(action){
        action(function(listener){
            listener(scope.message);
        });
    });

    scope.connect = that.createEvent('connect', function (action) {
        action(function (listener) {
            listener({username: scope.message, password: 'a'});
        });
    });

    that.showLogin = function(username){
        scope.messageLog += 'Logged as: ' + username + '\n';
        //scope.login = username;
        applyChanges()
    };

    that.showError = function(error){
        //scope.error = error;
        scope.messageLog += 'Error: ' + error + '\n';
        applyChanges()
    };

    var applyChanges = function(){
        if(!scope.$$phase) {
            scope.$apply();
        }
    }
}

ChatController.prototype = Object.create(EventListener);