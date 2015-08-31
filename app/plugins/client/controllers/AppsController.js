function AppsController(scope, appLoader, newTab, createRoom){
    Controller.call(this, scope);
     var that = this;

    //var createRoom = new

    scope.newApp = function(name){
        var roomData = null;

        createRoom(name)
            .then(function(room){
                room.app = name;
                roomData = room;
                return appLoader.load(name);
            })
            .then(function(data){
                newTab(data.name, data.html, data.mainFunc, roomData);
            })
            .then(function(){
                that.applyChanges();
            })
            .catch(function(err){
                //that.applyChanges();
                console.log(err)
            });
    }
}