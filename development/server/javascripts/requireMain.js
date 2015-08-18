
module.exports = function(server){
    var chat = require('./interactors/chat'),
        serverInteractors = require('./interactors/server'),
        dataChannel = require('./plugins/dataChannel'),
        socketio = require('socket.io')().listen(server),
        repositories = require('./plugins/repositories'),
        orm = require("orm"),
        entities = require('./entities/entities'),
        loki = require('lokijs');

    var ormDB = new repositories.OrmDB(orm);

    ormDB.connect("mysql://root:@localhost/broGaming")
        .then(function () {
            var userRepo = new repositories.UsersRepository(ormDB);
            var newDataChannel = new dataChannel.DataChannel(socketio);
            var authenticateUser = new serverInteractors.AuthenticateUser(userRepo.findUsersByUsername);

            newDataChannel.registerOnIncomingConnection(authenticateUser.do);

            console.log('Done');
        })
        .catch(function(err){
            console.error(err);
        });
};