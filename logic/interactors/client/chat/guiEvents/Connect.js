function Connect(connect){
    var that = this;

    that.do = function(credentials){
        connect(credentials);
    }
}