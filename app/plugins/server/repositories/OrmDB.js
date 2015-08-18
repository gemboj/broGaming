function OrmDB(orm){
    var that = this;
    that.orm = orm;

    var db  = null;

    that.connect = function(url){
        return new Promise(function (resolve, reject) {
            orm.connect(url, function (err, _db) {
                if(err) reject(err);
                db = _db;

                that.getDb = function(){
                    return db;
                };

                resolve();
            });
        });
    };

    that.getDb = function(){
        throw 'not connected to database';
    }
}