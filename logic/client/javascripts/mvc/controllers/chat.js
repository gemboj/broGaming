function chatController(scope){
    var that = this;
    that.scope = scope;

    that.scope.message = '';

    that.onSendEvents = [];
    that.sendMessage = function(){
        for(var i = 0; i < that.onSendEvents.length; ++i){
            that.onSendEvents[i](scope.message);
        }
    };
    that.registerOnSendMessage = function(func){
        that.onSendEvents.push(func);
    };

    that.init = function($scope) {
        scope = $scope;
        $scope.sendMessage = that.sendMessage;
    };
}