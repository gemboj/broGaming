define('chat', function (){
var chat = {};

chat.TransferData = function(output){
    this.output = output;

    this.do = function(data){
        this.output(data);
    }
};

return chat;
});