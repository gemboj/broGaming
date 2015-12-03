function RoomsService(scope, chatStaticData){
    Service.call(this, scope);
    var that = this;

    this.rooms = [];
    this.selectedUsers = [];
    this.invitesEnabled = false;

    this.enableInvites = function(enable){
        if(enable !== undefined){
            that.invitesEnabled = enable;
            return;
        }
        that.invitesEnabled = !that.invitesEnabled;
    };

    this.switchRoom = function(room){
        if(chatStaticData.currentRoom !== null){
            chatStaticData.currentRoom.users.forEach(function(user){
                user.selected = false;
            });
        }
        that.enableInvites(false);
        that.selectedUsers = [];

        chatStaticData.currentRoom = room;
    };

    this.newRoom = function(id, name, usernames, host){
        var room = new Room(id, name, usernames, host);
        that.rooms.push(room);

        that.switchRoom(room);

        return room;
    };

    this.leaveRoom = that.createEvent('leaveRoom', function(action, roomId){
        action(function(listener){
            listener(roomId);
        });
    });

    function Room(id, name, usernames, host){
        this.id = id;
        this.name = name;
        this.users = [];
        this.host = host;
        this.app = null;

        usernames.forEach(function(element){
            this.users.push(new that.User(element, false));
        }, this);

        this.isCurrent = function(){
            return this === chatStaticData.currentRoom;
        }
    };

    this.User = function(username, selected){
        this.username = username;
        this.selected = selected;

        this.isSelected = function(){
            return this.selected;
        }
    }
}