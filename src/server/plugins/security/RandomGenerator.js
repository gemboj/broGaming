function RandomGenerator(crypto){

    this.generateBytes = function(length){
        return new Promise(function(resolve, reject){
            crypto.randomBytes(length, function(ex, buf) {
                resolve(buf.toString('hex'));
            });
        });
    };
}