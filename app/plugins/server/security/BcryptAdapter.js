function BcryptAdapter(bcrypt){
    var that = this;

    this.hash = function(stringToHash){
        return new Promise(function(resolve, reject){
            bcrypt.hash(stringToHash, 10, function(err, hash){
                if(err){
                    return reject();
                }

                return resolve(hash);
            });
        });
    }
    
    this.compare = function(password, hash){
        return new Promise(function(resolve, reject){
            bcrypt.compare(password, hash, function(err, res){
                if(err !== undefined) {
                    reject('error');
                }

                resolve(res);
            })
        });
    }
}