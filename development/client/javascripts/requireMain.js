require.config({
    paths: {
        angular: 'vendors/angular',
        //chat: 'interactors/chat',
        controllers: 'plugins/controllers',
        io: 'vendors/socket.io',
        dataChannel: 'plugins/DataChannel',
        dataChannelChatEvents: 'interactors/chat/dataChannelEvents',
        guiChatEvents: 'interactors/chat/guiEvents'
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

require(['dataChannelChatEvents', 'guiChatEvents', 'controllers', 'dataChannel', 'angular', 'io'], function (dataChannelChatEvents, guiChatEvents, controllers, DataChannel, angular, io) {
    var dataChannel = new DataChannel.DataChannel(io);

    createAngularController(angular, 'chatController', function($scope){
        var chatController = new controllers.ChatController($scope);


        registerGuiChatEvents(dataChannel, chatController, guiChatEvents);
        registerDataChannelChatEvents(dataChannel, chatController, dataChannelChatEvents);
    });
});

function createAngularController(angular, name, cb){
    angular.module('broGaming', [])
        .controller(name, ['$scope', function ($scope) {
            cb($scope);

            $scope.cosm = 'asdf';
            $scope.cos = function(){
                $scope.cosm = 'ddgdddhdhdh';
            }
        }]);

    angular.element(document).ready(function() {
        angular.bootstrap(document, ['broGaming']);
    });
}

function registerGuiChatEvents(dataChannel, chatController, events){
    chatController.registerOnSendMessage(dataChannel.chat.send);
    chatController.registerOnConnect(dataChannel.connect);
}

function registerDataChannelChatEvents(dataChannel, chatController, events){
    //dataChannel.chat.registerOnReceiveMessage((new events.ShowMessage(chatController)).do);
    dataChannel.registerOnConnected(chatController.showLogin);
    dataChannel.registerOnError(chatController.showError);
}