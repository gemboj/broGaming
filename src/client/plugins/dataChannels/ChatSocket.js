function ChatSocket(dataChannel){
    EventListener.call(this);
    var that = this;

    that.send = function(eventType, data){
        var _package = {data: data,  eventType: eventType};

        return dataChannel.send('chat', _package);
    };

    that.events = {};
    that.events.privateMessage = that.createEvent('privateMessage', function(action, data){
        action(function(listener){
            listener(data.sender, data.message);
        });
    });

    that.events.roomMessage = that.createEvent('roomMessage', function(action, data){
        action(function(listener){
            listener(data.sender, data.roomName, data.message);
        });
    });

    that.events.roomInvite = that.createEvent('roomInvite', function(action, data){
        action(function(listener){
            listener(data.sender, data.roomName, data.roomId, data.app);
        });
    });

    that.events.error = that.createEvent('error', function(action, error){
        action(function(listener){
            listener(error);
        });
    });

    that.events.someoneLeftRoom = that.createEvent('someoneLeftRoom', function(action, data){
        action(function(listener){
            listener(data.username, data.roomId);
        });
    });

    that.events.someoneJoinedRoom = that.createEvent('someoneJoinedRoom', function(action, data){
        action(function(listener){
            listener(data.username, data.roomId);
        });
    });

    that.events.joinedRoom = that.createEvent('joinedRoom', function(action, data){
        action(function(listener){
            listener(data.id, data.name, data.usernames, data.host);
        });
    });

    dataChannel.registerApplication('chat', that.events);
}

ChatSocket.prototype = Object.create(EventListener);