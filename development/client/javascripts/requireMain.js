require.config({
    paths: {
        angular: 'vendors/angular',
        //chat: 'interactors/chat',
        controllers: 'plugins/controllers',
        io: 'vendors/socket.io',
        dataChannel: 'plugins/dataChannel',
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

require(['dataChannelChatEvents', 'guiChatEvents', 'controllers', 'dataChannel', 'angular', 'io'], function (dataChannelChatEvents, guiChatEvents, controllers, dataChannels, angular, io) {
    var dataChannel = new dataChannels.DataChannel(io);
    var chatChannel = new dataChannels.ChatChannel(dataChannel);
    createAngularController(angular, 'chatController', function($scope){
        var chatController = new controllers.ChatController($scope);


        chatController.registerOnSendMessage(chatChannel.send);
        chatController.registerOnConnect(dataChannel.connect);

        //dataChannel.chat.registerOnReceiveMessage((new events.ShowMessage(chatController)).do);
        dataChannel.registerOnConnected(chatController.showLogin);
        dataChannel.registerOnError(chatController.showError);
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

function registerChatEvents(chatChannel, chatController){
    chatController.registerOnSendMessage(dataChannel.chat.send);
    chatController.registerOnConnect(dataChannel.connect);
}

function registerGuiChatEvents(dataChannel, chatController){
    chatController.registerOnSendMessage(dataChannel.chat.send);
    chatController.registerOnConnect(dataChannel.connect);
}

function registerDataChannelChatEvents(dataChannel, chatController){
    //dataChannel.chat.registerOnReceiveMessage((new events.ShowMessage(chatController)).do);
    dataChannel.registerOnConnected(chatController.showLogin);
    dataChannel.registerOnError(chatController.showError);
}