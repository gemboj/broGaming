require.config({
    paths: {
        angular: 'vendors/angular',
        chat: 'logic/chat',
        chatController: 'mvc/chatController',
        io: 'vendors/socket.io',
        dataChannel: 'dataChannel/dataChannel'
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

require(['chat', 'chatController', 'dataChannel'], function (chat, chatController, dataChannel) {

    var transferData = new chat.TransferData(dataChannel.send);
    chatController.registerOnSendMessage(dataChannel.send);
});