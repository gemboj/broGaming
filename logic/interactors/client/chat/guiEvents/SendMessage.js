function SendMessage(dataChannelSend){

    this.do = function(message, recipient){
        dataChannelSend({type: 'message', message: message, recipient: recipient});
    }
}