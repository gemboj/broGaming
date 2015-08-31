require.config({
    paths : {
        jquery : 'vendors/jquery-2.1.4.min',
        angular : 'vendors/angular',
        controllers : 'plugins/controllers',
        services : 'plugins/services',
        io : 'vendors/socket.io',
        dataChannel : 'plugins/dataChannel',
        chatInteractors : 'interactors/chat',
    },
    shim : {
        angular : {
            exports : 'angular'
        },
        jquery : {
            exports : 'jquery-2.1.4.min'
        },
        io : {
            exports : 'io'
        }
    }
});

require(['jquery', 'controllers', 'services', 'dataChannel', 'angular', 'io', 'chatInteractors'], function(jquery, controllers, services, dataChannels, angular, io, chatInteractors){
    var dataChannel = new dataChannels.DataChannel(io);
    var chatChannel = new dataChannels.ChatChannel(dataChannel);

    var controllerProvider = null;
    var app = angular.module('broGaming', []).config(function($sceProvider, $controllerProvider){
        // Completely disable SCE.  For demonstration purposes only!
        // Do not use in new projects.
        controllerProvider = $controllerProvider;
        $sceProvider.enabled(false);
    });

    app.directive('compile', function($compile){
        return {
            restrict : 'A',
            link : function(scope, element, attr){
                element.append($compile(attr.compile)(scope));
            }
        }
    });

    app.factory('appLoader', ['tabsService', 'roomsService', '$rootScope', function(tabsService, roomsService, $rootScope){
        var createRoom = new chatInteractors.CreateRoom(chatChannel.send, roomsService.newRoom);
        return new services.AppLoader($rootScope, $.ajax, require, createRoom.do, tabsService.newTab);
    }]);

    app.factory('chatStaticData', [function(){
        var o = {};

        o.currentRoom = null;
        o.currentUser = null;

        o.isConnected = function(){
            return o.currentUser !== null;
        };

        return o;
    }]);

    app.factory('tabsService', ['$rootScope', function($rootScope){
        return new services.TabsService($rootScope, controllerProvider);
    }]);

    app.factory('roomsService', ['chatStaticData', '$rootScope', function(chatStaticData, $rootScope){
        return new services.RoomsService($rootScope, chatStaticData);
    }]);



    var sendData = new chatInteractors.SendData(chatChannel.send);

    createAngularController(app, 'sendingMessagesController', function($scope){
        var sendingMessagesController = new controllers.SendingMessagesController($scope);

        sendingMessagesController.registerOnSendMessage(function(data){
            console.dir(data)
        });

        var sendRoomData = new chatInteractors.SendRoomData(chatChannel.send);

        sendingMessagesController.registerOnSendMessage(sendData.do);
        sendingMessagesController.registerOnSendRoomMessage(sendRoomData.do);
    });

    createAngularController(app, 'receivingMessagesController', function($scope){
        var receivingMessagesController = new controllers.ReceivingMessagesController($scope);

        dataChannel.registerOnConnected(receivingMessagesController.showLogin);

        dataChannel.registerOnError(receivingMessagesController.showError);

        chatChannel.registerOnError(receivingMessagesController.showError);
        chatChannel.registerOnRoomMessage(receivingMessagesController.showRoomMessage);
        chatChannel.registerOnMessage(receivingMessagesController.showMessage);
    });

    createAngularController(app, 'connectionController', function($scope){
        var connectionController = new controllers.ConnectionController($scope);

        connectionController.registerOnConnect(dataChannel.connect)

        dataChannel.registerOnConnected(connectionController.saveCurrentUser);
    });

    app.controller('roomsController', ['$scope', 'roomsService', 'chatStaticData', 'appLoader', function($scope, roomsService, chatStaticData, appLoader){
        var roomsController = new controllers.RoomsController($scope, roomsService, chatStaticData);

        var createRoom = new chatInteractors.CreateRoom(chatChannel.send, roomsController.newRoom);
        var leaveRoom = new chatInteractors.LeaveRoom(chatChannel.send, roomsController.removeRoomById);
        var receiveRoomInvite = new chatInteractors.ReceiveRoomInvite(roomsController.addInvite, chatChannel.send, roomsController.newRoom, appLoader.createApp);

        roomsController.registerOnCreateRoom(createRoom.do);
        roomsController.registerOnLeaveRoom(leaveRoom.do);
        roomsController.registerOnSendRoomInvite(sendData.do);

        chatChannel.registerOnJoinedRoom(roomsController.newRoom);
        chatChannel.registerOnSomeoneJoinedRoom(roomsController.addUser);
        chatChannel.registerOnSomeoneLeftRoom(roomsController.removeUser);
        chatChannel.registerOnRoomInvite(receiveRoomInvite.do);

        dataChannel.registerOnDisconnect(roomsController.deleteRooms);
    }]);


    createAngularController(app, 'canvasController', function($scope){
        var canvasController = new controllers.CanvasController($scope);
    });

    app.controller('appsController', ['$scope', 'appLoader', 'tabsService', 'roomsService', function($scope, appLoader){
        var appsController = controllers.AppsController($scope, appLoader.createApp);
    }]);

    app.controller('tabsController', ['$scope', 'tabsService', 'roomsService', 'chatStaticData', function($scope, tabsService, roomsService, chatStaticData){
        var tabsController = new controllers.TabsController($scope, tabsService, roomsService, chatStaticData);

        tabsController.addTab('apps', 0, '<div ng-controller="appsController"><p ng-click="newApp(\'test\')">ffgfghf</p></div>');

        //var appLoader = new ajax.AppLoader($.ajax, tabsController.newTab);
        //appLoader.load('test');
    }]);

    angular.bootstrap(document, ['broGaming']);
});

function createAngularController(app, name, cb){
    app.controller(name, ['$scope', '$element', 'chatStaticData', function($scope, $element, chatStaticData){
        $scope._element = $element;
        $scope._chatStaticData = chatStaticData;
        cb($scope);
    }]);

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
