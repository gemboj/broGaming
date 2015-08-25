function SequelizeDB(Sequelize){
    var db = new Sequelize('broGaming', 'root', '', {
        host : "127.0.0.1",
        dialect : 'mysql',
        define : {
            timestamps : false
        }
        //logging: false
    });

    var users = db.define('users', {
            username : {
                type : Sequelize.STRING,
                primaryKey : true
            },
            password : Sequelize.STRING,
            is_logged : Sequelize.BOOLEAN,
            is_active : Sequelize.BOOLEAN
        },
        {
            underscored : true
        });

    var rooms = db.define('rooms', {
            id : {
                type : Sequelize.INTEGER,
                primaryKey : true
            },
            name : Sequelize.STRING,
            is_deletable : Sequelize.BOOLEAN
        },
        {
            underscored : true
        });

    var users_rooms = db.define('users_rooms', {
            users_username : {
                type : Sequelize.STRING,
            },
            rooms_id : {
                type : Sequelize.INTEGER,
            }
        },
        {underscored : true});

    users.belongsToMany(rooms, {through : users_rooms, foreignKey : 'users_username'});
    rooms.belongsToMany(users, {through : users_rooms, foreignKey : 'rooms_id'});

    var that = this;
    this.connect = function(){
        return db.sync()
            .then(function(){

                /*return that.deleteAllRooms()
                 .then(function(){
                 return db.transaction(function(t){
                 return rooms.build({id : 1, name : 'name1', is_deletable : false}).save()
                 .then(function(){
                 return rooms.build({id : 2, name : 'name2', is_deletable : false}).save();
                 })
                 .then(function(){
                 return users_rooms.build({users_username: 'gemboj', rooms_id: 1}).save()
                 })
                 .catch(function(err){
                 console.log(err);
                 })
                 .then(function(arg){
                 return that.insertRoom({id : 3, name : 'room3', deletable : false})

                 })
                 .then(function(){
                 //return that.usernameJoinsRoomid('gemboj', 2);
                 return users_rooms.build({users_username: 'gemboj', rooms_id: 2}).save()
                 });
                 });

                 //return that.insertRoom({id : 1, name : 'room1', deletable : false});
                 })

                 .then(function(arg){
                 return that.usernameJoinsRoomid('gemboj', 3);
                 })
                 .catch(function(err){
                 console.log(err);
                 })
                 .then(function(){

                 });*/
                return that;
            })
    };

    this.transaction = function(func){
        return db.transaction(function(t){
            return func(t);
        })
            .then(function(result){
                //commit
                console.log('commit');
                return result
            })
            .catch(function(err){
                console.log('rollback');
                throw err;
            })
    };

    this.isAuthenticCredentials = function(credentials){
        return Promise.resolve();
    };

    this.markAsLoggedUsername = function(username){
        return users.update({
            is_logged : true
        }, {
            where : {
                username : username
            }
        });
    };

    this.markAsNotLoggedUser = function(username){
        return users.update({
            is_logged : false
        }, {
            where : {
                username : username
            }
        });
    };

    this.removeUsernameFromAllRooms = function(username){
        return users_rooms.destroy({
            where : {
                users_username : username
            }
        });
    };

    this.insertRoom = function(room){
        return rooms.build({id : room.id, name : room.name, is_deletable : room.deletable}).save();
    };

    var roomId = 0;
    this.getNextRoomid = function(){
        return Promise.resolve(roomId++);
    };

    this.usernameJoinsRoomid = function(username, roomId, t){
        var transaction = {};
        t !== undefined ? transaction.transaction = t : null;

        return users_rooms.build({users_username : username, rooms_id : roomId}).save(transaction);
    };

    this.getRoomWithUsersById = function(roomId, t){
        var transaction = {
            where : {id : roomId},
            include : [
                users
            ]
        };
        t !== undefined ? transaction.transaction = t : null;

        return rooms.findOne(transaction)
            .then(function(data){
                var users = [];
                var dataValue = data.dataValues;
                for(var i = 0; i < dataValue.users.length; ++i){
                    var userDataValue = dataValue.users[i].dataValues;
                    users.push(new User(userDataValue.username, userDataValue.password, userDataValue.is_logged, userDataValue.is_active));
                }

                return new Room(dataValue.id, dataValue.name, dataValue.is_deletable, users);
            });
    };

    this.deleteAllRooms = function(){
        return users_rooms.destroy({
            where : {}
        })
            .then(function(){
                rooms.destroy({
                    where : {}
                })
            })

    };

    this.logoutAllUsers = function(){
        return users.update({
            is_logged : false
        }, {
            where : {}
        });
    };

    this.removeUsernameFromRoomid = function(username, roomId){
        return users_rooms.destroy({
            where : {
                users_username : username,
                rooms_id : roomId
            }
        })
    };

    this.removeRoomById = function(roomId){
        return rooms.destroy({
            where : {
                id : roomId
            }
        })
    };

    this.getUsernameRooms = function(username){
        return users.findOne({
            where : {
                username : username
            },
            include : [
                rooms
            ]
        })
            .then(function(userData){
                var dataValue = userData.dataValues;
                var rooms = [];

                for(var i = 0; i < dataValue.rooms.length; ++i){
                    var roomDataValue = dataValue.rooms[i].dataValues;
                    rooms.push(new Room(roomDataValue.id, roomDataValue.name, roomDataValue.is_deletable));
                }

                return rooms;
            })
    }
}