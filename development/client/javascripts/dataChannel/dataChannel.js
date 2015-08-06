define(['io'], function (io){
    var dataChannel = {};

    dataChannel.connect = function(data) {
        alert('connecting: ' + data);
    };

    dataChannel.send = function(data) {
        alert('sending: ' + data);
    };

    dataChannel.receive = function(data) {
        alert('receiving: ' + data);
    };

    return dataChannel;
});