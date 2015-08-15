
module.exports = function(server){
    var chat = require('./interactors/chat');
    var serverInteracots = require('./interactors/server');

    var dataChannel = require('./plugins/dataChannel');
    var socketio = require('socket.io')().listen(server);
    var repositories = require('./plugins/repositories');
    var orm = require("orm");


    var newDataChannel = new dataChannel.DataChannel(socketio);
    var userRepo = new repositories.UserRepository(orm);
    var authenticate = new serverInteracots.Authenticate(userRepo.findUsersByUsername);

    newDataChannel.registerOnNewConnection(authenticate.do);

    /*newDataChannel.registerOnShowMessage(function(message){
        console.log(message);
    });*/
//newDataChannel.showMessage();

    function get() {
        return new Promise(function(resolve, reject) {
            // Do the usual XHR stuff
           setTimeout(function(){resolve()}, 2000);
        });
    }

    get().then(function(){
        console.log('success');
    })
};