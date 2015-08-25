module.exports = function(server){
    var chat = require('./interactors/chat'),
        authorizationInteractors = require('./interactors/authorization'),
        chatInteractors = require('./interactors/chat'),
        dataChannel = require('./plugins/dataChannel'),
        socketio = require('socket.io')().listen(server),
        repositories = require('./plugins/repositories'),
        orm = require("orm"),
    //entities = require('./entities/entities'),
        loki = require('lokijs'),
        Sequelize = require('sequelize');

    var util = require('util');


    /*var db = new Sequelize('broGaming', 'root', '', {
        host : "127.0.0.1",
        dialect : 'mysql',
        define : {
            timestamps : false
        }
    });

    var users = db.define('users', {
        username : {
            type : Sequelize.STRING,
            primaryKey : true
        },
        password : Sequelize.STRING,
        is_logged : Sequelize.BOOLEAN,
        is_active : Sequelize.BOOLEAN
    });

    var rooms = db.define('rooms', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            name: Sequelize.STRING,
            is_deletable: Sequelize.BOOLEAN
        },
        {
            underscored: true
        }
    );

    var users_rooms = db.define('users_rooms', {
            users_username: {
                type: Sequelize.STRING
            },
            rooms_id: {
                type: Sequelize.INTEGER
            }
        },
        {
            underscored: true
        }
    );

    users.belongsToMany(rooms, {through: users_rooms, foreignKey: 'users_username'});
    rooms.belongsToMany(users, {through: users_rooms, foreignKey: 'rooms_id'});

    db.sync().then(function(){
        users.findAll({
            where: {
                username: 'gemobj'
            },
            include:[
                rooms
            ]
        })
            .then(function(result){
                console.log(util.inspect(result, false, null));
            })
    });
    console.log('done');*/


    var db = new repositories.SequelizeDB(Sequelize);

    db.connect()
        .then(function(sequelizeRepo){
            var socketDataChannel = new dataChannel.DataChannel(socketio);
            var chatChannel = new dataChannel.ChatChannel(socketDataChannel);

            var joinRoom = new chatInteractors.JoinRoom(sequelizeRepo.usernameJoinsRoomid, sequelizeRepo.getRoomWithUsersById, chatChannel.send);
            var autoJoinRoom = new chatInteractors.AutoJoinRoom(joinRoom.do, chatChannel.send);
            var leaveRoom = new chatInteractors.LeaveRoom(sequelizeRepo.getRoomWithUsersById, chatChannel.send, sequelizeRepo.removeUsernameFromRoomid, sequelizeRepo.removeRoomById);
            var createDefaultRooms = new chatInteractors.CreateDefaultRooms(sequelizeRepo.insertRoom, sequelizeRepo.getNextRoomid);
            var deleteTemporaryData = new chatInteractors.DeleteTemporaryData(sequelizeRepo.deleteAllRooms, sequelizeRepo.logoutAllUsers);
            var createRoom = new chatInteractors.CreateRoom(sequelizeRepo.insertRoom, sequelizeRepo.getNextRoomid, joinRoom.do);

            var login = new authorizationInteractors.Login(sequelizeRepo.isAuthenticCredentials, sequelizeRepo.markAsLoggedUsername);
            var logout = new authorizationInteractors.Logout(sequelizeRepo.markAsNotLoggedUser, sequelizeRepo.getUsernameRooms, leaveRoom.do);



            socketDataChannel.registerOnIncomingConnection(login.do);
            socketDataChannel.registerOnDisconnected(logout.do);
            socketDataChannel.registerOnNewConnection(autoJoinRoom.do);

            chatChannel.registerOnCreateRoom(createRoom.do);
            chatChannel.registerOnLeaveRoom(leaveRoom.do);

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