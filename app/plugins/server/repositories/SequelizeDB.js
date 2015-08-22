function SequelizeDB(Sequelize){
    var db = new Sequelize('mysql://root:@localhost/broGaming');

    var users = db.define('users', {
        username: Sequelize.STRING,
        password: Sequelize.STRING,
        is_logged: Sequelize.BOOLEAN,
        is_active: Sequelize.BOOLEAN
    });

    var rooms = db.define('rooms', {
        id: Sequelize.INTEGER,
        name: Sequelize.STRING,
        is_deletable: Sequelize.BOOLEAN
    });

    var users_rooms = db.define('users_rooms', {
        users_username: Sequelize.STRING,
        rooms_id: Sequelize.INTEGER
    })

    this.transaction = function(func){
        return db.transaction(function (t) {
            return func(t);
        })
            .then(function(){
                //commit
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
            is_logged: true
        }, {
            where: {
                username: username
            }
        });
    };

    this.markAsNotLoggedUser = function(username){
        return users.update({
            is_logged: false
        }, {
            where: {
                username: username
            }
        });
    };

    this.removeUsernameFromAllRooms = function(username){
        return users_rooms.destroy({
            where: {
                users_username: username
            }
        });
    };

    this.insertRoom = function(room){
        return rooms.build({id: room.id, name: room.name, is_deletable: room.deletable}).save();
    };

    var roomId = 0;
    this.getNextRoomid = function(){
        return Promise.resolve(roomId++);
    };

    this.usernameJoinsRoomid = function(username, roomId){
        return users_rooms.build({users_username: username, rooms__id: roomId}).save();
    };

    this.getUsersInRoomId = function(roomId){
        return Promise.resolve([new User('username', 'a', 1, 1)]);
    }
}