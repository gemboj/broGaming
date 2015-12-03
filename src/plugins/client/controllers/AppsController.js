function AppsController(scope, createApp){
    Controller.call(this, scope);
     var that = this;

    scope.newApp = function(name){
        createApp(name)
            .then(function(){
                that.applyChanges();
            });

    }
}