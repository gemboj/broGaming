define([], function (){
var guiEvents = {};

guiEvents.Connect = function(connect){
    var that = this;

    that.do = function(credentials){
        connect(credentials);
    }
}
guiEvents.SendMessage = function(dataChannelSend){

    this.do = function(message, recipient){
        dataChannelSend({type: 'message', message: message, recipient: recipient});
    }
}

return guiEvents;
});