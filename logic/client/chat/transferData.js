function TransferData(output){
    this.output = output;

    this.do = function(data){
        this.output(data);
    }
};