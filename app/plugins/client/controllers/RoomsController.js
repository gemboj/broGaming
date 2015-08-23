function RoomsController(scope){
    Controller.call(this, scope);
    var that = this;

    var showRooms = false;
    scope.toggleRooms = function(){
        showRooms = !showRooms;
    };

    scope.switchRoom = function(room){
        scope._chatStaticData.currentRoom = room;
    };

    scope._chatStaticData.currentRoom = null;
    var rooms = [

    ];

    function Room(id, name, users){
        this.id = id;
        this.name = name;
        this.users = users;

        this.isCurrent = function(){
            return this === scope._chatStaticData.currentRoom;
        }
    }

    scope.getCurrentRoom = function(){
        return scope._chatStaticData.currentRoom;
    }

    scope.roomsVisible = function(){
        return showRooms;
    }

    scope.getRooms = function(){
        return rooms;
    }

    this.addRoom = function(data){
        var room = new Room(data.id, data.name, data.usernames);
        rooms.push(room);
        if(rooms.length === 1){
            scope._chatStaticData.currentRoom = room;
        }

        that.applyChanges();
    }
}