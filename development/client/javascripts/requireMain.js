require.config({
    paths: {
        angular: 'vendors/angular',
        chat: 'interactors/chat',
        controllers: 'plugins/controllers',
        io: 'vendors/socket.io',
        dataChannel: 'plugins/dataChannel'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        io: {
            exports: 'io'
        }
    }
});

require(['chat', 'controllers', 'dataChannel', 'angular'], function (chat, controllers, dataChannel, angular) {
    createAngularController(angular, 'chatController', function($scope){
        var chatController = new controllers.chatController($scope);
        chatController.registerOnSendMessage(function(message){console.log(message)});
    });

});

function createAngularController(angular, name, cb){
    angular.module('broGaming', [])
        .controller(name, ['$scope', function ($scope) {
            cb($scope);
        }]);
}