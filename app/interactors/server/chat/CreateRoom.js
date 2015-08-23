function CreateRoom(insertRoom, getNextRoomid){

    this.do = function(roomName){
        return getNextRoomid().then(function(id){
            return insertRoom(new Room(id, roomName, true, []))
        });
    };
}