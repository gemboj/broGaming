
module.exports = function(server){
    var chat = require('./interactors/chat');
    var dataChannel = require('./plugins/dataChannel');
    var socketio = require('socket.io')().listen(server);

    var newDataChannel = new dataChannel.DataChannel(socketio);
    /*newDataChannel.registerOnShowMessage(function(message){
        console.log(message);
    });*/
//newDataChannel.showMessage();
};