define([], function (){
var dataChannelEvents = {};

dataChannelEvents.ShowLogin = function(showLogin){
    var that = this;

    that.do = function(username){
        showLogin(username);
    }
}
dataChannelEvents.ShowMessage = function(showMessage){

    this.do = function(message){
        showMessage(message);
    }
}

return dataChannelEvents;
});