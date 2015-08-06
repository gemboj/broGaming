define(function (){
var chat = {};

chat.TransferData = function(output){
    var that = this;

    that.output = output;

    this.do = function(data){
        that.output(data);
    }
};

return chat;
});