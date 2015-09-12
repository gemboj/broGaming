require.config({
    paths : {
        jquery : 'vendors/jquery-2.1.4.min',
        angular : 'vendors/angular',
        controllers : 'plugins/controllers',
        services : 'plugins/services',
        io : 'vendors/socket.io',
        dataChannels : 'plugins/dataChannels',
        chatInteractors : 'interactors/chat',
        AJAX: 'plugins/AJAX',
        validationInteractors: 'interactors/formValidation'
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

require([
    'jquery',
    'controllers',
    'services',
    'dataChannels',
    'angular', 'io',
    'chatInteractors',
    'AJAX',
    'validationInteractors'
], function(
    jquery,
    controllers,
    services,
    dataChannels,
    angular,
    io,
    chatInteractors,
    AJAX,
    validationInteractors
){
    var userLoginFormValidation = new validationInteractors.UserLoginForm();
    var userRegisterFormValidation = new validationInteractors.UserRegistrationForm(userLoginFormValidation.do);

    var $ajaxAdapted = new AJAX.JQAJAXAdapter($.ajax);

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

    app.factory('tabsService', ['$rootScope', 'messageLogService', function($rootScope, messageLogService){
        return new services.TabsService($rootScope, controllerProvider, webRTCAdapter, messageLogService);
    }]);

    app.factory('roomsService', ['chatStaticData', '$rootScope', function(chatStaticData, $rootScope){
        return new services.RoomsService($rootScope, chatStaticData);
    }]);

    app.factory('messageLogService', ['$rootScope', function($rootScope){
        return new services.MessageLogService($rootScope);
    }]);




    var sendPrivateMessage = new chatInteractors.SendPrivateMessage(chatSocket.send);
    var sendRoomMessage = new chatInteractors.SendRoomMessage(chatSocket.send);

    app.controller('sendingMessagesController', ['$scope', 'chatStaticData', function($scope, chatStaticData){
        var sendingMessagesController = new controllers.SendingMessagesController($scope, chatStaticData);

        sendingMessagesController.registerOnSendMessage(function(data){
            console.dir(data)
        });

        sendingMessagesController.registerOnSendMessage(sendPrivateMessage.do);
        sendingMessagesController.registerOnSendRoomMessage(sendRoomMessage.do);
    }]);

    app.controller('messageLogController', ['$scope', 'messageLogService', function($scope, messageLogService){
        var receivingMessagesController = new controllers.MessageLogController($scope, messageLogService);

        socketAdpter.registerOnConnected(messageLogService.showLogin);
        socketAdpter.registerOnError(messageLogService.showError);

        chatSocket.registerOnError(messageLogService.showError);
        chatSocket.registerOnRoomMessage(messageLogService.showRoomMessage);
        chatSocket.registerOnPrivateMessage(messageLogService.showMessage);
    }]);

    app.controller('connectionController', ['$scope', 'chatStaticData', function($scope, chatStaticData){
        var connectionController = new controllers.ConnectionController($scope, chatStaticData, userLoginFormValidation.do, userRegisterFormValidation.do);

        //var register = new chatInteractors.Register($ajaxAdapted.post, 'user', messageLogService.showInfo);

        connectionController.registerOnConnect(socketAdpter.connect);
        //connectionController.registerOnRegister(register.do);

        socketAdpter.registerOnConnected(connectionController.saveCurrentUser);

    }]);

    app.controller('registerController', ['$scope', 'chatStaticData', 'messageLogService', function($scope, chatStaticData, messageLogService){
        var registerController = new controllers.RegisterController($scope, userRegisterFormValidation.do);

        var register = new chatInteractors.Register($ajaxAdapted.post, 'user', messageLogService.showInfo);

        //connectionController.registerOnConnect(socketAdpter.connect);
        registerController.registerOnRegister(register.do);

        //socketAdpter.registerOnConnected(connectionController.saveCurrentUser);

    }]);

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

    app.controller('appsController', ['$scope', 'appLoader', 'tabsService', 'roomsService', function($scope, appLoader){
        var appsController = controllers.AppsController($scope, appLoader.createApp);
    }]);

    app.controller('tabsController', ['$scope', 'tabsService', 'roomsService', 'chatStaticData', 'appLoader', 'messageLogService', function($scope, tabsService, roomsService, chatStaticData, appLoader){
        var tabsController = new controllers.TabsController($scope, tabsService, roomsService, chatStaticData);

        appLoader.loadEjs('apps')
            .then(function(html){
                tabsController.addTab('apps', 0, html);
            });
    }]);

    angular.bootstrap(document, ['broGaming']);
});