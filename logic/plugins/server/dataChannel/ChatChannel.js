function ChatChannel(dataChannel){
    EventListener.call(this);
    var that = this;

    var eventsNames = [
        'privateMessage'
    ];

    that.send = function(user, type, _data){
        var data = _data;
        data.eventType = type;

        dataChannel.send(user, 'chat', data);
    };

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