function RoomsController(scope, roomsService, chatStaticData){
    Controller.call(this, scope);
    var that = this;

    scope.createRoomName = '';

    var showRooms = false;
    var rooms = roomsService.rooms;;

    scope.switchRoom = roomsService.switchRoom;

    

    scope.toggleRooms = function(){
        showRooms = !showRooms;
    };

    scope.isSelectedUsers = function(){
        return roomsService.selectedUsers.length > 0;
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

    this.newRoom = function(id, name, usernames, host){
        var room = roomsService.newRoom(id, name, usernames, host);

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
            roomsService.selectedUsers.push(user);
        }
        else{
            var index = roomsService.selectedUsers.indexOf(user);

            if(index > -1){
                roomsService.selectedUsers.splice(index, 1);
            }
        }
    };

    this.deleteRooms = function(){
        rooms = [];
        chatStaticData.currentRoom = null;
    };

    this.addUser = function(username, roomId){
        var room = undefined;
        for(var i = 0; i < rooms.length; ++i){
            if(rooms[i].id === roomId){
                room = rooms[i];
                break;
            }
        }

        if(room !== undefined){
            room.users.push(new that.User(username, false));
            that.applyChanges()
        }
    };

    this.removeUser = function(username, roomId){
        var room = undefined;

        for(var i = 0; i < rooms.length; ++i){
            if(rooms[i].id === roomId){
                room = rooms[i];
                break;
            }
        }

        if(room !== undefined){
            var index = -1;
            var user = null;
            for(var i = 0; i < room.users.length; ++i){
                if(room.users[i].username === username){
                    user = room.users[i];
                    index = i;
                    break;
                }
            }

            if(index > -1){
                room.users.splice(index, 1);

                index = roomsService.selectedUsers.indexOf(user);
                if(index > -1){
                    roomsService.selectedUsers.splice(index, 1);
                }
            }


        }

        that.applyChanges();
    };

    this.removeRoomById = function(roomId){
        for(var i = 0; i < rooms.length; ++i){
            if(rooms[i].id === roomId){
                var roomName = rooms[i].name;

                rooms.splice(i, 1);

                if(rooms.length === 0){
                    chatStaticData.currentRoom = null;
                }
                else if(roomName === chatStaticData.currentRoom.name){
                    chatStaticData.currentRoom = rooms[0];
                }

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
            for(var i = 0; i < roomsService.selectedUsers.length; ++i){
                listener(room.id, roomsService.selectedUsers[i].username, room.app);
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