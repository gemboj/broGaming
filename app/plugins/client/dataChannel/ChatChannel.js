function ChatChannel(dataChannel){
    EventListener.call(this);
    var that = this;

    var eventsNames = [
        'receiveMessage',
        'roomUsers'
    ];

    that.send = function(eventType, data, cb){
        var _package = {data: data, eventType: eventType};
        dataChannel.send('chat', _package, cb);
    };

    that.events = {};
    for(var i = 0; i < eventsNames.length; ++i){
        that.events[eventsNames[i]] = that.createEvent(eventsNames[i], function (action, data) {
            action(function (listener) {
                listener(data);
            });
        });
    }

    dataChannel.registerApplication('chat', that.events);
}

ChatChannel.prototype = Object.create(EventListener);