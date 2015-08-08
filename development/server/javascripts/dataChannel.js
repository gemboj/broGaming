var dataChannel = {};

dataChannel.DataChannel = function(socketio){
    var that = this;
    that.socket = socketio;

    that.connect = function(data) {
        alert('connecting: ' + data);
    };

    that.send = function(data) {
        alert('sending: ' + data);
    };

    that.receive = function(data) {
        alert('receiving: ' + data);
    };
}

module.exports = dataChannel;