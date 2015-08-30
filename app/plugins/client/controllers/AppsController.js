function AppsController(scope, appLoader, newTab, createRoom){
    Controller.call(this, scope);
     var that = this;

    //var createRoom = new

    scope.newApp = function(name){
        var roomData = null;

        createRoom('test')
            .then(function(room){
                roomData = room;
                return appLoader.load('test');
            })
            .then(function(data){
                newTab(data.name, data.html, data.mainFunc, roomData);
            })
            .then(function(){
                that.applyChanges();
            })
            .catch(function(err){
                that.applyChanges();
                //console.log(err)
            });
    }
}