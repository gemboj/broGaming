(function(angular){
    var chatController = {},
        scope = null;

    chatController.onSendEvents = [];
    chatController.sendMessage = function(){
        for(var i = 0; i < chatController.onSendEvents.length; ++i){
            chatController.onSendEvents[i](scope.message);
        }
    };
    chatController.registerOnSendMessage = function(func){
        chatController.onSendEvents.push(func);
    };

    chatController.init = function($scope) {
        scope = $scope;
        $scope.sendMessage = chatController.sendMessage;
    };

    chatController.registerOnSendMessage(function(message){alert(message)});

    angular.module('broGaming', [])
        .factory('chatController', [function(){
            return chatController;
        }])
        .controller('chatModel', ['$scope', 'chatController', function ($scope, chatController) {
            $scope.message = '';

            chatController.init($scope);
        }]);

    window.MVC !== undefined ? window.MVC.chat = chatController : window.MVC = {chat: chatController};
})(angular);