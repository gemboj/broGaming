function CryptoAdapter(crypto){
    var that = this;

    this.hash = function(stringToHash){
        return new Promise(function(resolve, reject){
            var hash = crypto.createHash('md5').update(stringToHash).digest('hex');

            return resolve(hash);
         });
    };

    this.compare = function(originalString, hash){
        return new Promise(function(resolve, reject){
            var hashedString = crypto.createHash('md5').update(originalString).digest('hex');

            return resolve(hashedString === hash);
        });
    };
}