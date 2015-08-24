function ChatChannel(dataChannel){
    EventListener.call(this);
    var that = this;

    var eventsNames = [
        'receiveMessage',
        'joinedRoom',
        'someoneJoinedRoom',
        'someoneLeftRoom',
        'error'
    ];

    that.send = function(eventType, data){
        var _package = {data: data, eventType: eventType};


        return new Promise(function(resolve, reject){
            dataChannel.send('chat', _package, function(data, error){
                if(error === undefined){
                    resolve(data);
                }

                reject(error);
            });
        });
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