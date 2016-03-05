function BcryptAdapter(bcrypt){
    //outdated
    var that = this;

    this.hash = function(stringToHash){
        /*return new Promise(function(resolve, reject){
            resolve('someHash');
        });*/
        /*return new Promise(function(resolve, reject){
            bcrypt.hash(stringToHash, 10, function(err, hash){
                if(err){
                    return reject(err);
                }

                return resolve(hash);
            });
        });*/
    }
    
    this.compare = function(originalString, hash){
        /*return new Promise(function(resolve, reject){
            resolve(true);
        });*/
        /*return new Promise(function(resolve, reject){
            bcrypt.compare(originalString, hash, function(err, res){
                if(err !== undefined) {
                    reject('error');
                }

                resolve(res);
            })
        });*/
    }
}