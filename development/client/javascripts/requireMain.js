require.config({
    paths: {
        jquery: 'vendors/jquery-2.1.4.min',
        angular: 'vendors/angular',
        controllers: 'plugins/controllers',
        io: 'vendors/socket.io',
        dataChannel: 'plugins/dataChannel',
        chatTnteractors: 'interactors/chat'
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

require(['jquery', 'controllers', 'dataChannel', 'angular', 'io', 'chatTnteractors'], function (jquery, controllers, dataChannels, angular, io, chatTnteractors) {
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





    createAngularController(app, 'sendingMessagesController', function($scope){
        var sendingMessagesController = new controllers.SendingMessagesController($scope);

        sendingMessagesController.registerOnSendMessage(function(data){
            console.dir(data)
        });

        var sendRoomData = new chatTnteractors.SendRoomData(chatChannel.send);
        sendingMessagesController.registerOnSendMessage(sendRoomData.do);
    });

    createAngularController(app, 'receivingMessagesController', function($scope){
        var receivingMessagesController = new controllers.ReceivingMessagesController($scope);


        dataChannel.registerOnConnected(receivingMessagesController.showLogin);

        dataChannel.registerOnError(receivingMessagesController.showError);
        chatChannel.registerOnError(receivingMessagesController.showError);
        chatChannel.registerOnRoomMessage(receivingMessagesController.showRoomMessage);
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

        var createRoom = new chatTnteractors.CreateRoom(chatChannel.send, roomsController.addRoom);
        var leaveRoom = new chatTnteractors.LeaveRoom(chatChannel.send, roomsController.removeRoomById);

        roomsController.registerOnCreateRoom(createRoom.do);
        roomsController.registerOnLeaveRoom(leaveRoom.do);

        chatChannel.registerOnJoinedRoom(roomsController.addRoom);
        chatChannel.registerOnSomeoneJoinedRoom(roomsController.addUser);
        chatChannel.registerOnSomeoneLeftRoom(roomsController.removeUser);

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
