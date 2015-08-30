function RoomsController(scope, roomsService, chatStaticData){
    Controller.call(this, scope);
    var that = this;

    scope.selectedUsers = roomsService.selectedUsers;
    scope.createRoomName = '';

    var showRooms = false;
    var rooms = roomsService.rooms;;

    scope.switchRoom = roomsService.switchRoom;



    scope.toggleRooms = function(){
        showRooms = !showRooms;
    };



    this.User = roomsService.User;

    scope.getCurrentRoom = function(){
        return chatStaticData.currentRoom;
    };

    scope.isConnected = function(){
        return chatStaticData.currentUser !== null;
    };

    scope.roomsVisible = function(){
        return showRooms;
    };

    scope.getRooms = function(){
        return rooms;
    };

    this.newRoom = function(data){
        var room = roomsService.newRoom(data);

        that.applyChanges();

        return room;
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

    scope.leaveRoom = roomsService.leaveRoom;
    this.registerOnLeaveRoom = roomsService.registerOnLeaveRoom;

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
        chatStaticData.currentRoom = null;
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

                if(chatStaticData.currentRoom.name === rooms[i].name){
                    chatStaticData.currentRoom = rooms[0];
                }

                rooms.splice(i, 1);
                break;
            }
        }
        that.applyChanges()
    };

    scope.isInvitesEnabled = function(){
        return roomsService.invitesEnabled;
    };

    scope.enableInvites = roomsService.enableInvites;

    scope.sendRoomInvite = that.createEvent('sendRoomInvite', function(action, room){
        scope.enableInvites(false);
        action(function(listener){
            for(var i = 0; i < scope.selectedUsers.length; ++i){
                listener(scope.selectedUsers[i].username, 'roomInvite', {roomId: room.id, roomName: room.name, sendersUsername: chatStaticData.currentUser.username});
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