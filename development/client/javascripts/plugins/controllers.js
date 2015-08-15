define(["/../plugins"], function (plugins){
var controllers = {};

controllers.ChatController = function(scope){
    plugins.EventListener.call(this);
    var that = this;

    var scope = scope;


    scope.message = 'fgfghfgh';
    scope.login = 'fvnvn';
    scope.error = '';

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

controllers.ChatController.prototype = Object.create(plugins.EventListener);

return controllers;
});