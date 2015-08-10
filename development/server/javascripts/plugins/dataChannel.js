var dataChannel = {};
var plugins = require("./../plugins");

dataChannel.DataChannel = function(socketio){
    plugins.EventListener.call(this);
    var that = this;
    that.socket = socketio;

    that.showMessage = that.createEvent('showMessage', function(cb){
        cb('fgvfvnvbn message');
    });

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

dataChannel.DataChannel.prototype = Object.create(plugins.EventListener);

module.exports = dataChannel;