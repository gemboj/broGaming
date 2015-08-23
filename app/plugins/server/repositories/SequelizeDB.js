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
                primaryKey : true
            },
            rooms_id : {
                type : Sequelize.INTEGER,
                primaryKey : true
            }
        },
        {underscored : true});

    users.belongsToMany(rooms, {through : users_rooms, foreignKey : 'users_username'});
    rooms.belongsToMany(users, {through : users_rooms, foreignKey : 'rooms_id'});

    var that = this;
    this.connect = function(){
        return db.sync()
            .then(function(){
                return that;
            })
    };

    this.transaction = function(func){
        return db.transaction(function(t){
            return func(t);
        })
            .then(function(result){
                //commit
                return result
            })
            .catch(function(err){
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
        return users_rooms.build({users_username : username, rooms__id : roomId}).save();
    };

    this.getRoomWithUsersById = function(roomId, t){
        return Promise.resolve(new Room(0, 'Main', 0, [new User('username', 'a', 1, 1)]));
    };

    this.deleteAllRooms = function(){
        return rooms.destroy({
            where : {}
        })
    };

    this.logoutAllUsers = function(){
        return users.update({
            is_logged : false
        }, {
            where : {}
        });
    };
}