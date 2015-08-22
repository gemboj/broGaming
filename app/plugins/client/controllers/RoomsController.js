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

    scope._chatStaticData.currentRoom = new Room(1, 'name1', ['user1', 'user2']);
    var rooms = [
        scope._chatStaticData.currentRoom,
        new Room(2, 'name2', ['dfgdgdfg', 'udgdfgdgdfgser2', 'blabla']),
        new Room(3, 'name3', ['ktost52', 'ghgh', '56', '456'])
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
}