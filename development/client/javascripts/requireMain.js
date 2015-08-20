require.config({
    paths: {
        angular: 'vendors/angular',
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
        angularRouter: {
            exports: 'angular-ui-router'
        },
        io: {
            exports: 'io'
        }
    }
});

require(['dataChannelChatEvents', 'guiChatEvents', 'controllers', 'dataChannel', 'angular', 'io'], function (dataChannelChatEvents, guiChatEvents, controllers, dataChannels, angular, io) {
    var app = angular.module('broGaming', []);

    var dataChannel = new dataChannels.DataChannel(io);
    var chatChannel = new dataChannels.ChatChannel(dataChannel);

    /*createAngularController(angular, 'chatController', function($scope){
        var chatController = new controllers.ChatController($scope);


        chatController.registerOnSendMessage(chatChannel.send);
        chatController.registerOnConnect(dataChannel.connect);


        //dataChannel.chat.registerOnReceiveMessage((new events.ShowMessage(chatController)).do);
        dataChannel.registerOnConnected(chatController.showLogin);
        dataChannel.registerOnError(chatController.showError);

        chatChannel.registerOnRoomUsers(function(data){
            console.dir(data);
        });
    });*/

    var func = null;




    createAngularController(app, 'sendingMessagesController', function($scope){
        var sendingMessagesController = new controllers.SendingMessagesController($scope);

        sendingMessagesController.registerOnSendMessage(function(message){
            func.showMessage(message);
        });
    });

    createAngularController(app, 'receivingMessagesController', function($scope){
        var receivingMessagesController = new controllers.ReceivingMessagesController($scope);
        func = receivingMessagesController;
    });

    createAngularController(app, 'tabsController', function($scope){
        var tabsController = new controllers.TabsController($scope);
    });

    createAngularController(app, 'connectionController', function($scope){
        var connectionController = new controllers.ConnectionController($scope);

        connectionController.registerOnConnect(function(data){
            console.dir(data);
        })
    });

    createAngularController(app, 'canvasController', function($scope){
        var canvasController = new controllers.CanvasController($scope);
    });

    createAngularController(app, 'appsController', function($scope){

    });

    /*app.config([
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider) {

            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: '/home.html',
                    controller: 'connectionController'
                })
                .state('apps', {
                    url: '/apps',
                    templateUrl: '/apps.html',
                    controller: 'appsController'
                });

            $urlRouterProvider.otherwise('home');
            $locationProvider.html5Mode(true);
        }]);*/

    angular.bootstrap(document, ['broGaming']);

});

function createAngularController(app, name, cb){
    app.controller(name, ['$scope', function ($scope) {
        cb($scope);
    }]);

}

function createAngularModule(module){

}

/*
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
}*/
