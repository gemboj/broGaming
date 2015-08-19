var chat = {};
var entities = require("./../entities/entities");

chat.CreateDefaultRooms = function(insertRoom, getNextRoomid){

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
                    insertRoom(new entities.Room(id, roomNames[i], false));
                })
            );
        }

        return arr;
    }
}
chat.JoinRoom = function(usernameJoinsRoomid, getUsersInRoomId, send){
    var that = this;

    that.do = function(username, roomId){
        roomId = roomId === undefined ? 0 : roomId;
        return usernameJoinsRoomid(username, roomId)
            .then(function(){
                return getUsersInRoomId(roomId);
            })
            .then(function(users){
                var data = {};
                data[roomId] = users
                send(username, 'roomUsers', data);
            })
            .catch(function(err){
                console.log(err);
            });
    }
}

module.exports = chat;