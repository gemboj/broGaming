
module.exports = function(server){
    var chat = require('./interactors/chat');
    var serverInteractors = require('./interactors/server');

    var dataChannel = require('./plugins/dataChannel');
    var socketio = require('socket.io')().listen(server);
    var repositories = require('./plugins/repositories');
    var orm = require("orm");


    var ormDB = new repositories.OrmDB(orm);

    ormDB.connect("mysql://root:@localhost/broGaming")
        .then(function () {
            var userRepo = new repositories.UsersRepository(ormDB);
            var newDataChannel = new dataChannel.DataChannel(socketio);
            var authenticate = new serverInteractors.Authenticate(userRepo.findUsersByUsername);

            newDataChannel.registerOnIncomingConnection(authenticate.do);

            console.log('Done');
        })
        .catch(function(err){
            console.error('db error:');
            console.error(err);
        });
};