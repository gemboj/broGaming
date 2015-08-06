function TransferData(output){
    var that = this;

    that.output = output;

    this.do = function(data){
        that.output(data);
    }
};