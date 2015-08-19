
module.exports = function(server){
    var chat = require('./interactors/chat'),
        authorizationInteractors = require('./interactors/authorization'),
        chatInteractors = require('./interactors/chat'),
        dataChannel = require('./plugins/dataChannel'),
        socketio = require('socket.io')().listen(server),
        repositories = require('./plugins/repositories'),
        orm = require("orm"),
        //entities = require('./entities/entities'),
        loki = require('lokijs');

    var ormDB = new repositories.OrmDB(orm);

    ormDB.connect("mysql://root:@localhost/broGaming")
        .then(function () {
            var userRepo = new repositories.UsersRepository(ormDB);

            var lokiDBRepository = new repositories.LokiDBRepository(loki);
            //var loggedUserRepo = new repositories.LoggedUsersRepository(lokiDb);

            var socketDataChannel = new dataChannel.DataChannel(socketio);
            var chatChannel = new dataChannel.ChatChannel(socketDataChannel);

            var authenticateUser = new authorizationInteractors.AuthenticateUser(userRepo.findUsersByUsername);
            var login = new authorizationInteractors.Login(lokiDBRepository.insertLoggedUser);
            var verifyConnection = new authorizationInteractors.VerifyConnection(authenticateUser.do, login.do);
            var logout = new authorizationInteractors.Logout(lokiDBRepository.removeLoggedUserByUsername);

            var joinRoom = new chatInteractors.JoinRoom(lokiDBRepository.usernameJoinsRoomid, lokiDBRepository.getLoggedUsersInRoomid, chatChannel.send);
            var createDefaultRooms = new chatInteractors.CreateDefaultRooms(lokiDBRepository.insertRoom, lokiDBRepository.getNextRoomid);

            createDefaultRooms.do();

            socketDataChannel.registerOnIncomingConnection(verifyConnection.do);
            socketDataChannel.registerOnDisconnected(logout.do);
            socketDataChannel.registerOnNewConnection(joinRoom.do);

            console.log('Done');
        })
        .catch(function(err){
            console.trace(err);
        });
};