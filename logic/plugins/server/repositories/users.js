function UserRepository(orm){
    var that = this;

    that.orm = orm;

    that.findUsersByUsername = function(input){
        orm.connect("mysql://root:@localhost/broGaming", function (err, db) {
            if(err) throw err;

            var User = loadUser(db);

            User.find({ username: input.username }, function (err, users) {
                if(err) throw err;

                input.successCb(users);
            });
        });
    };

    var loadUser = function(db){
        return db.define("users", {
            username      : String,
            password   : String
        },{
            id: 'username'
        });
    }
}