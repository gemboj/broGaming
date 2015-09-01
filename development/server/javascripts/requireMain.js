module.exports = function(server){
    var chat = require('./interactors/chat'),
        authorizationInteractors = require('./interactors/authorization'),
        chatInteractors = require('./interactors/chat'),
        webrtcInteractors = require('./interactors/webrtc'),
        dataChannel = require('./plugins/dataChannel'),
        socketio = require('socket.io')().listen(server),
        repositories = require('./plugins/repositories'),
        orm = require("orm"),
    //entities = require('./entities/entities'),
        loki = require('lokijs'),
        Sequelize = require('sequelize');

    var util = require('util');

    var db = new repositories.SequelizeDB(Sequelize);

    db.connect()
        .then(function(sequelizeRepo){
            var socketDataChannel = new dataChannel.DataChannel(socketio);
            var chatChannel = new dataChannel.ChatChannel(socketDataChannel);
            var webrtcChannel = new dataChannel.WebRTCChannel(socketDataChannel);

            var joinRoom = new chatInteractors.JoinRoom(sequelizeRepo.usernameJoinsRoomid, sequelizeRepo.getRoomWithUsersById, chatChannel.send);
            var autoJoinRoom = new chatInteractors.AutoJoinRoom(joinRoom.do, chatChannel.send);
            var leaveRoom = new chatInteractors.LeaveRoom(sequelizeRepo.getRoomWithUsersById, chatChannel.send, sequelizeRepo.removeUsernameFromRoomid, sequelizeRepo.removeRoomById);
            var createDefaultRooms = new chatInteractors.CreateDefaultRooms(sequelizeRepo.insertRoom, sequelizeRepo.getNextRoomid);
            var deleteTemporaryData = new chatInteractors.DeleteTemporaryData(sequelizeRepo.deleteAllRooms, sequelizeRepo.logoutAllUsers);
            var createRoom = new chatInteractors.CreateRoom(sequelizeRepo.insertRoom, sequelizeRepo.getNextRoomid, joinRoom.do);
            var sendRoomMessage = new chatInteractors.SendRoomMessage(sequelizeRepo.getRoomWithUsersById, chatChannel.send);
            var roomInvite = new chatInteractors.RoomInvite(chatChannel.send, sequelizeRepo.getRoomWithUsersById);
            var privateMessage = new chatInteractors.PrivateMessage(chatChannel.send, sequelizeRepo.getUserByUsername);

            var login = new authorizationInteractors.Login(sequelizeRepo.isAuthenticCredentials, sequelizeRepo.markAsLoggedUsername);
            var logout = new authorizationInteractors.Logout(sequelizeRepo.markAsNotLoggedUser, sequelizeRepo.getUsernameRooms, leaveRoom.do);

            var offer = new webrtcInteractors.Offer(webrtcChannel.send);
            var answer = new webrtcInteractors.Answer(webrtcChannel.send);
            var iceCandidate = new webrtcInteractors.IceCandidate(webrtcChannel.send);

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