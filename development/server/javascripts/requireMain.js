module.exports = function(server){
    var chat = require('./interactors/chat'),
        authorizationInteractors = require('./interactors/authorization'),
        chatInteractors = require('./interactors/chat'),
        webrtcInteractors = require('./interactors/webrtc'),
        validationInteractors = require('./interactors/validation'),
        dataChannel = require('./plugins/dataChannel'),
        socketio = require('socket.io')().listen(server),
        repositories = require('./plugins/repositories'),
        orm = require("orm"),
        security = require('./plugins/security'),
        loki = require('lokijs'),
        Sequelize = require('sequelize'),
        bcrypt = require('bcrypt'),
        formValidationInteractors = require('./interactors/formValidation'),
        email = require('./plugins/email'),
        nodemailer = require('nodemailer'),
        crypto = require('crypto');

    var util = require('util');

    var db = new repositories.SequelizeDB(Sequelize);

    db.connect()
        .then(function(sequelizeRepo){
            var socketDataChannel = new dataChannel.DataChannel(socketio);
            var chatChannel = new dataChannel.ChatChannel(socketDataChannel);
            var webrtcChannel = new dataChannel.WebRTCChannel(socketDataChannel);

            var bcryptAdapted = new security.BcryptAdapter(bcrypt);
            var randomGenerator = new security.RandomGenerator(crypto);

            var nodemailerAdapter = new email.NodemailerAdapter(nodemailer);

            var userLoginFormValidation = new formValidationInteractors.UserLoginForm();
            var userRegistrationFormValidation = new formValidationInteractors.UserRegistrationForm(userLoginFormValidation.do);

            var joinRoom = new chatInteractors.JoinRoom(sequelizeRepo.usernameJoinsRoomid, sequelizeRepo.getRoomWithUsersById, chatChannel.send, sequelizeRepo.transaction);
            var autoJoinRoom = new chatInteractors.AutoJoinRoom(joinRoom.do, chatChannel.send);
            var leaveRoom = new chatInteractors.LeaveRoom(sequelizeRepo.getRoomWithUsersById, chatChannel.send, sequelizeRepo.removeUsernameFromRoomid, sequelizeRepo.removeRoomById);
            var createDefaultRooms = new chatInteractors.CreateDefaultRooms(sequelizeRepo.insertRoom, sequelizeRepo.getNextRoomid);
            var deleteTemporaryData = new chatInteractors.DeleteTemporaryData(sequelizeRepo.deleteAllRooms, sequelizeRepo.logoutAllUsers);
            var createRoom = new chatInteractors.CreateRoom(sequelizeRepo.insertRoom, sequelizeRepo.getNextRoomid, joinRoom.do, sequelizeRepo.transaction);
            var sendRoomMessage = new chatInteractors.SendRoomMessage(sequelizeRepo.getRoomWithUsersById, chatChannel.send);
            var roomInvite = new chatInteractors.RoomInvite(chatChannel.send, sequelizeRepo.getRoomWithUsersById);
            var privateMessage = new chatInteractors.PrivateMessage(chatChannel.send, sequelizeRepo.getUserByUsername);
            var userRegistrationValidation = new validationInteractors.UserRegistration(sequelizeRepo.getUserByUsername, userRegistrationFormValidation.do);

            var login = new authorizationInteractors.Login(sequelizeRepo.getUserByUsername, sequelizeRepo.markAsLoggedUsername, bcryptAdapted.compare);
            var logout = new authorizationInteractors.Logout(sequelizeRepo.markAsNotLoggedUser, sequelizeRepo.getUsernameRooms, leaveRoom.do);
            var register = new authorizationInteractors.Register(bcryptAdapted.hash, userRegistrationValidation.do, sequelizeRepo.insertUser, nodemailerAdapter.send, sequelizeRepo.setActivationLinkForUsername, randomGenerator.generateBytes, global.staticData.address, sequelizeRepo.transaction);
            var activateAccount = new authorizationInteractors.ActivateAccount(sequelizeRepo.getUserByActivationLink, sequelizeRepo.markAsActiveUserByUsername);

            var offer = new webrtcInteractors.Offer(webrtcChannel.send);
            var answer = new webrtcInteractors.Answer(webrtcChannel.send);
            var iceCandidate = new webrtcInteractors.IceCandidate(webrtcChannel.send);
            var webrtcError = new webrtcInteractors.Error(webrtcChannel.send);

            socketDataChannel.registerOnIncomingConnection(login.do);
            socketDataChannel.registerOnDisconnected(logout.do);
            socketDataChannel.registerOnNewConnection(autoJoinRoom.do);

            chatChannel.registerOnCreateRoom(createRoom.do);
            chatChannel.registerOnJoinRoom(joinRoom.do);
            chatChannel.registerOnLeaveRoom(leaveRoom.do);
            chatChannel.registerOnSendRoomMessage(sendRoomMessage.do);
            chatChannel.registerOnPrivateMessage(privateMessage.do);
            chatChannel.registerOnRoomInvite(roomInvite.do);

            webrtcChannel.registerOnOffer(offer.do);
            webrtcChannel.registerOnAnswer(answer.do);
            webrtcChannel.registerOnIceCandidate(iceCandidate.do);
            webrtcChannel.registerOnError(webrtcError.do);

            global.routing.user = register.do;
            global.routing.activateAccount = activateAccount.do;

            return deleteTemporaryData.do()
                .then(function(){
                    createDefaultRooms.do();
                });
        })
        .then(function(){
            console.log('Done');
        })
        .catch(function(err){
            console.log(err);
        });

};