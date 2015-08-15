function ChatChannel(dataChannel){
    EventListener.call(this);
    var that = this;

    var eventsNames = [
        'privateMessage'
    ];

    var events = {};

    eventsNames.forEach(function(event){
        events[event] = that.createEvent(event, function (action, data) {
            action(function (listener) {
                listener(data);
            });
        });
    });

    dataChannel.registerEvents('chat', events);
}

ChatChannel.prototype = Object.create(EventListener);