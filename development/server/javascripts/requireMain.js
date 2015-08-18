
module.exports = function(server){
    var chat = require('./interactors/chat');
    var serverInteractors = require('./interactors/server');

    var dataChannel = require('./plugins/dataChannel'),
        socketio = require('socket.io')().listen(server),
        repositories = require('./plugins/repositories'),
        orm = require("orm"),
        entities = require('./entities/entities'),
        loki = require('loki');

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