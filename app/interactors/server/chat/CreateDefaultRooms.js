function CreateDefaultRooms(insertRoom, getNextRoomid){

    var roomNames = [
        'Main'
    ];

    this.do = function(_roomNames){

        roomNames = _roomNames === undefined ? roomNames : _roomNames;

        var promisesArr = createPromisesArray();

        return Promise.all(promisesArr)
            .then(function(values){

            });

    };

    function createPromisesArray(){
        var arr = [];

        for(var i = 0; i < roomNames.length; ++i){
            var _i = i;
            arr.push(
                getNextRoomid()
                    .then(function(id){
                        insertRoom(new Room(id, roomNames[_i], false));
                    })
            );
        }

        return arr;
    }
}