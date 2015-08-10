define(["/../plugins"], function (plugins){
var controllers = {};

controllers.chatController = function(scope){
    plugins.EventListener.call(this);
    var that = this;

    that.scope = scope;

    that.scope.message = '';

    that.scope.sendMessage = that.createEvent('sendMessage', function(cb){
        cb(that.scope.message);
    });
}

controllers.chatController.prototype = Object.create(plugins.EventListener);

return controllers;
});