function ChatChannel(dataChannel){
    EventListener.call(this);
    var that = this;

    var eventsNames = [
        'privateMessage'
    ];

    that.send = function(user, type, _data){
        var _package = {data: _data, eventType: type};

        dataChannel.send(user, 'chat', _package);
    };

    var events = {};
    eventsNames.forEach(function(event){
        events[event] = that.createEvent(event, function (action, data) {
            action(function (listener) {
                listener(data);
            });
        });
    });

    events['createRoom'] = that.createEvent('createRoom', function(action, data){
        action(function(listener){
            listener(data.roomName, data._sendersUsername);
        });
    });


    dataChannel.registerEvents('chat', events);
}

ChatChannel.prototype = Object.create(EventListener);