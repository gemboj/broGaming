function SequelizeDB(Sequelize){
    var db = new Sequelize('mysql://root:@localhost/broGaming');

    var users = db.define('users', {
        username: Sequelize.STRING,
        password: Sequelize.STRING,
        is_logged: Sequelize.INTEGER,
        is_active: Sequelize.INTEGER
    });

    var rooms = db.define('rooms', {
        id: Sequelize.INTEGER,
        name: Sequelize.STRING
    });

    var users_rooms = db.define('users_rooms', {
        users_username: Sequelize.STRING,
        rooms_id: Sequelize.INTEGER
    })
}