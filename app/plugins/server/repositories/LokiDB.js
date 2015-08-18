function LokiDB(Loki){
    var that = this;

    var db  = new Loki('broGamingChat.json');

    var users = db.addCollection('users');

    that.getDb = function(){
        return db;
    }

    that.getUsersCollection = function(){
        return users;
    }
}