function CreateDefaultRooms(insertRoom, getNextRoomid){

    var roomNames = [
        'Main'
    ];

    this.do = function(){
        var promisesArr = createPromisesArray();

        return Promise.all(promisesArr)
            .then(function(values){
                console.log(values);
            });

    };

    function createPromisesArray(){
        var arr = [];

        for(var i = 0; i < roomNames.length; ++i){
            arr.push(
                getNextRoomid().then(function(id){
                    insertRoom(new Room(id, roomNames[i], false));
                })
            );
        }

        return arr;
    }
}