var chat = require('./interactors/chat');
var dataChannel = require('./plugins/dataChannel');


var newDataChannel = new dataChannel.DataChannel({});
newDataChannel.registerOnShowMessage(function(message){
    console.log(message);
});
newDataChannel.showMessage();

console.log('requireMain');