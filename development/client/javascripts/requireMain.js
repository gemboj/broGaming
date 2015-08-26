require.config({
    paths: {
        jquery: 'vendors/jquery-2.1.4.min',
        angular: 'vendors/angular',
        controllers: 'plugins/controllers',
        io: 'vendors/socket.io',
        dataChannel: 'plugins/dataChannel',
        chatInteractors: 'interactors/chat',
        ajax: 'plugins/AJAX'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        jquery: {
            exports: 'jquery-2.1.4.min'
        },
        io: {
            exports: 'io'
        }
    }
});

require(['jquery', 'controllers', 'dataChannel', 'angular', 'io', 'chatInteractors', 'ajax'], function (jquery, controllers, dataChannels, angular, io, chatInteractors, ajax) {
    var app = angular.module('broGaming', []).config(function($sceProvider) {
        // Completely disable SCE.  For demonstration purposes only!
        // Do not use in new projects.
        $sceProvider.enabled(false);
    });

    app.directive('compile', function($compile) {
        return {
            restrict:'A',
            link: function(scope, element, attr) {
                element.append($compile(attr.compile)(scope));
            }
        }
    });

    app.factory('chatStaticData', [function () {
        var o = {};

        o.curretnRoom = null;
        o.currentUser = null;

        return o;
    }]);

    var dataChannel = new dataChannels.DataChannel(io);
    var chatChannel = new dataChannels.ChatChannel(dataChannel);

    var appLoader = new ajax.AppLoader($.ajax);

    appLoader.load('test');
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


    createAngularController(app, 'roomsController', function($scope){
        var roomsController = new controllers.RoomsController($scope);
        /*roomsController.registerOnCreateRoom(function(roomName){
            chatChannel.send('createRoom', {roomName: roomName});
        });*/

        var createRoom = new chatInteractors.CreateRoom(chatChannel.send, roomsController.addRoom);
        var leaveRoom = new chatInteractors.LeaveRoom(chatChannel.send, roomsController.removeRoomById);
        var receiveRoomInvite = new chatInteractors.ReceiveRoomInvite(roomsController.addInvite, chatChannel.send, roomsController.addRoom);

        roomsController.registerOnCreateRoom(createRoom.do);
        roomsController.registerOnLeaveRoom(leaveRoom.do);
        roomsController.registerOnSendRoomInvite(sendData.do);

        chatChannel.registerOnJoinedRoom(roomsController.addRoom);
        chatChannel.registerOnSomeoneJoinedRoom(roomsController.addUser);
        chatChannel.registerOnSomeoneLeftRoom(roomsController.removeUser);
        chatChannel.registerOnRoomInvite(receiveRoomInvite.do);

        dataChannel.registerOnDisconnect(roomsController.deleteRooms);
    });

    createAngularController(app, 'canvasController', function($scope){
        var canvasController = new controllers.CanvasController($scope);
    });

    createAngularController(app, 'appsController', function($scope){

    });

    createAngularController(app, 'tabsController', function($scope, $compile){
        var tabsController = new controllers.TabsController($scope, $compile);
    });

    angular.bootstrap(document, ['broGaming']);

});

function createAngularController(app, name, cb){
    app.controller(name, ['$scope', '$element', 'chatStaticData', function ($scope, $element, chatStaticData) {
        $scope._element = $element;
        $scope._chatStaticData = chatStaticData;
        cb($scope, $element);
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
