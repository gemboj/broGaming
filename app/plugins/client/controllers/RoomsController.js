function RoomsController(scope){
    Controller.call(this, scope);
    var that = this;

    scope.selectedUsers = [];
    scope._chatStaticData.currentRoom = null;
    scope.createRoomName = '';

    var showRooms = false;
    var rooms = [];

    scope.switchRoom = function(room){
        if(scope._chatStaticData.currentRoom !== null){
            scope._chatStaticData.currentRoom.users.forEach(function(user){
                user.selected = false;
            });
        }
        scope.enableInvites(false);
        scope.selectedUsers = [];

        scope._chatStaticData.currentRoom = room;
    };



    scope.toggleRooms = function(){
        showRooms = !showRooms;
    };



    function Room(id, name, usernames){
        this.id = id;
        this.name = name;
        this.users = [];

        usernames.forEach(function(element){
            this.users.push(new User(element, false));
        }, this);

        this.isCurrent = function(){
            return this === scope._chatStaticData.currentRoom;
        }
    };



    function User(username, selected){
        this.username = username;
        this.selected = selected;

        this.isSelected = function(){
            return this.selected;
        }
    }

    scope.getCurrentRoom = function(){
        return scope._chatStaticData.currentRoom;
    };

    scope.roomsVisible = function(){
        return showRooms;
    };

    scope.getRooms = function(){
        return rooms;
    };

    this.addRoom = function(data){
        var room = new Room(data.id, data.name, data.usernames);
        rooms.push(room);

        scope.switchRoom(room);

        that.applyChanges();
    };

    this.createRoomEvent = that.createEvent('createRoom', function(action, roomName){
        action(function(listener){
            listener(roomName);
        });
    });


    scope.createRoom = function(){
        that.createRoomEvent(scope.createRoomName);
        scope.createRoomName = '';
    };

    scope.leaveRoom = that.createEvent('leaveRoom', function(action, roomId){
        action(function(listener){
            listener(roomId);
        });
    });



    scope.selectUser = function(user, selected){
        if(selected !== undefined){
            user.selected = selected;
        }
        else{
            user.selected = !user.selected;
        }

        if(user.selected){
            scope.selectedUsers.push(user);
        }
        else{
            var index = scope.selectedUsers.indexOf(user);

            if(index > -1){
                scope.selectedUsers.splice(index, 1);
            }
        }
    };

    this.deleteRooms = function(){
        rooms = [];
        scope._chatStaticData.currentRoom = null;
    };

    this.addUser = function(data){
        var room = undefined;
        for(var i = 0; i < rooms.length; ++i){
            if(rooms[i].id === data.roomId){
                room = rooms[i];
                break;
            }
        }

        if(room !== undefined){
            room.users.push(new User(data.username, false));
            that.applyChanges()
        }
    };

    this.removeUser = function(data){
        var room = undefined;
        for(var i = 0; i < rooms.length; ++i){
            if(rooms[i].id === data.roomId){
                room = rooms[i];
                break;
            }
        }

        if(room !== undefined){
            var index = -1;
            for(var i = 0; i < room.users.length; ++i){
                if(room.users[i].username === data.username){
                    index = i;
                    break;
                }
            }

            if(index > -1){
                room.users.splice(index, 1);
            }
            that.applyChanges()
        }
    };

    this.removeRoomById = function(roomId){
        for(var i = 0; i < rooms.length; ++i){
            if(rooms[i].id === roomId){

                if(scope._chatStaticData.currentRoom.name === rooms[i].name){
                    scope._chatStaticData.currentRoom = rooms[0];
                }

                rooms.splice(i, 1);
                break;
            }
        }
        that.applyChanges()
    };

    var enableInvites = false;
    scope.isInvitesEnabled = function(){
        return enableInvites;
    };

    scope.enableInvites = function(enable){
        if(enable !== undefined){
            enableInvites = enable;
            return;
        }
        enableInvites = !enableInvites;
    };

    scope.sendRoomInvite = that.createEvent('sendRoomInvite', function(action, room){
        action(function(listener){
            for(var i = 0; i < scope.selectedUsers.length; ++i){
                listener(scope.selectedUsers[i].username, 'roomInvite', {roomId: room.id, roomName: room.name, sendersUsername: scope._chatStaticData.currentUser.username});
            }
        });
    });

    scope.invites = [];
    this.addInvite = function(info){
        var invite = new Invite(info);
        scope.invites.push(invite);

        that.applyChanges();

        return new Promise(function(resolve, reject){
            invite.successCb = function(){
                removeInvite(invite);
                resolve();
            };

            invite.failCb = function(){
                removeInvite(invite);
                reject();
            }
        });
    };

    function removeInvite(invite){
        var index = scope.invites.indexOf(invite);
        if(index > -1){
            scope.invites.splice(index, 1);
        }
    }

    function Invite(info){
        this.info = info;
        this.successCb = null;
        this.failCb = null;
    }

    this.applyChanges()
}