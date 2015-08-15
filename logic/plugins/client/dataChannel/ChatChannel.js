function ChatChannel(dataChannel){
    EventListener.call(this);
    var that = this;

    var eventsNames = [
        'receiveMessage'
    ];

    that.events = {};
    that.send = function(data, cb){
        dataChannel.send('chat', data, cb);
    };

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