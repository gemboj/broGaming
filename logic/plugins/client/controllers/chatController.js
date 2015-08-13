function ChatController(scope){
    EventListener.call(this);
    var that = this;

    var scope = scope;


    scope.message = 'fgfghfgh';
    scope.login = 'fvnvn';
    scope.error = '';

    scope.sendMessage = that.createEvent('sendMessage', function(cb){
        cb(scope.message);
    });

    scope.connect = that.createEvent('connect', function(cb){
        cb({username: scope.message, password: 'password'});

    });

    that.showLogin = function(username){
        scope.login = username;
        applyChanges()
    }

    that.showError = function(error){
        scope.error = error;
        applyChanges()
    }

    var applyChanges = function(){
        if(!scope.$$phase) {
            scope.$apply();
        }
    }
}

ChatController.prototype = Object.create(EventListener);