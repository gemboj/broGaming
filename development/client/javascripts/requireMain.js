require.config({
    paths : {
        jquery : 'vendors/jquery-2.1.4.min',
        angular : 'vendors/angular',
        controllers : 'plugins/controllers',
        services : 'plugins/services',
        io : 'vendors/socket.io',
        dataChannels : 'plugins/dataChannels',
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

require(['jquery', 'controllers', 'services', 'dataChannels', 'angular', 'io', 'chatInteractors'], function(jquery, controllers, services, dataChannels, angular, io, chatInteractors){
    var socketAdpter = new dataChannels.SocketAdapter(io);
    var chatSocket = new dataChannels.ChatSocket(socketAdpter);
    var webRTCSocket = new dataChannels.WebRTCSocket(socketAdpter);

    var webRTCAdapter = new dataChannels.WebRTCAdapter(webRTCSocket.send, function(error){
        console.dir(error);
    });

    webRTCSocket.registerOnOffer(webRTCAdapter.onOffer);
    webRTCSocket.registerOnAnswer(webRTCAdapter.onAnswer);
    webRTCSocket.registerOnIceCandidate(webRTCAdapter.onIceCandidate);

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
        var createRoom = new chatInteractors.CreateRoom(chatSocket.send, roomsService.newRoom);
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
        return new services.TabsService($rootScope, controllerProvider, webRTCAdapter);
    }]);

    app.factory('roomsService', ['chatStaticData', '$rootScope', function(chatStaticData, $rootScope){
        return new services.RoomsService($rootScope, chatStaticData);
    }]);




    var sendPrivateMessage = new chatInteractors.SendPrivateMessage(chatSocket.send);
    var sendRoomMessage = new chatInteractors.SendRoomMessage(chatSocket.send);

    createAngularController(app, 'sendingMessagesController', function($scope){
        var sendingMessagesController = new controllers.SendingMessagesController($scope);

        sendingMessagesController.registerOnSendMessage(function(data){
            console.dir(data)
        });

        sendingMessagesController.registerOnSendMessage(sendPrivateMessage.do);
        sendingMessagesController.registerOnSendRoomMessage(sendRoomMessage.do);
    });

    createAngularController(app, 'messageLogController', function($scope){
        var receivingMessagesController = new controllers.MessageLogController($scope);

        socketAdpter.registerOnConnected(receivingMessagesController.showLogin);
        socketAdpter.registerOnError(receivingMessagesController.showError);

        chatSocket.registerOnError(receivingMessagesController.showError);
        chatSocket.registerOnRoomMessage(receivingMessagesController.showRoomMessage);
        chatSocket.registerOnPrivateMessage(receivingMessagesController.showMessage);
    });

    createAngularController(app, 'connectionController', function($scope){
        var connectionController = new controllers.ConnectionController($scope);

        connectionController.registerOnConnect(socketAdpter.connect);

        socketAdpter.registerOnConnected(connectionController.saveCurrentUser);
    });

    app.controller('roomsController', ['$scope', 'roomsService', 'chatStaticData', 'appLoader', function($scope, roomsService, chatStaticData, appLoader){
        var roomsController = new controllers.RoomsController($scope, roomsService, chatStaticData);

        var createRoom = new chatInteractors.CreateRoom(chatSocket.send, roomsController.newRoom);
        var leaveRoom = new chatInteractors.LeaveRoom(chatSocket.send, roomsController.removeRoomById);
        var receiveRoomInvite = new chatInteractors.ReceiveRoomInvite(roomsController.addInvite, chatSocket.send, roomsController.newRoom, appLoader.createApp);
        var sendRoomInvite = new chatInteractors.SendRoomInvite(chatSocket.send);

        roomsController.registerOnCreateRoom(createRoom.do);
        roomsController.registerOnLeaveRoom(leaveRoom.do);
        roomsController.registerOnSendRoomInvite(sendRoomInvite.do);

        chatSocket.registerOnJoinedRoom(roomsController.newRoom);
        chatSocket.registerOnSomeoneJoinedRoom(roomsController.addUser);
        chatSocket.registerOnSomeoneLeftRoom(roomsController.removeUser);
        chatSocket.registerOnRoomInvite(receiveRoomInvite.do);

        socketAdpter.registerOnDisconnect(roomsController.deleteRooms);
    }]);


    createAngularController(app, 'canvasController', function($scope){
        var canvasController = new controllers.CanvasController($scope);
    });

    app.controller('appsController', ['$scope', 'appLoader', 'tabsService', 'roomsService', function($scope, appLoader){
        var appsController = controllers.AppsController($scope, appLoader.createApp);
    }]);

    app.controller('tabsController', ['$scope', 'tabsService', 'roomsService', 'chatStaticData', function($scope, tabsService, roomsService, chatStaticData){
        var tabsController = new controllers.TabsController($scope, tabsService, roomsService, chatStaticData);

        tabsController.addTab('apps', 0, '<div ng-controller="appsController"><p ng-click="newApp(\'test\')">test</p><p ng-click="newApp(\'drawBoard\')">drawBoard</p></div>');

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
 chatController.registerOnSendMessage(dataChannels.chat.send);
 chatController.registerOnConnect(dataChannels.connect);
 }

 function registerGuiChatEvents(dataChannels, chatController){
 chatController.registerOnSendMessage(dataChannels.chat.send);
 chatController.registerOnConnect(dataChannels.connect);
 }

 function registerDataChannelChatEvents(dataChannels, chatController){
 //dataChannels.chat.registerOnReceiveMessage((new events.ShowMessage(chatController)).do);
 dataChannels.registerOnConnected(chatController.showLogin);
 dataChannels.registerOnError(chatController.showError);
 }*/
