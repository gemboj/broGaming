
module.exports = function(server){
    var chat = require('./interactors/chat'),
        authenticationInteractors = require('./interactors/authorization'),
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

            var authenticateUser = new authenticationInteractors.AuthenticateUser(userRepo.findUsersByUsername);
            var login = new authenticationInteractors.Login(lokiDBRepository.findLoggedUsersByUsername, lokiDBRepository.insertLoggedUser);
            var verifyConnection = new authenticationInteractors.VerifyConnection(authenticateUser.do, login.do);
            var logout = new authenticationInteractors.Logout(lokiDBRepository.removeLoggedUserByUsername);

            socketDataChannel.registerOnIncomingConnection(verifyConnection.do);
            socketDataChannel.registerOnDisconnected(logout.do);

            console.log('Done');
        })
        .catch(function(err){
            console.trace(err);
        });
};