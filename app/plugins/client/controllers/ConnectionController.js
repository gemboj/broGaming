function ConnectionController(scope){
    Controller.call(this, scope);
    var that = this;

    scope.username = 'gemboj';
    scope.password = 'a';

    scope.costam = 1;
    scope.cos = function(){
        scope.costam ++;
    };

    scope.connect = that.createEvent('connect', function (action) {
        action(function (listener) {
            listener({username: scope.username, password: scope.password});
        });
    });

    this.saveCurrentUser = function(username){
        scope._chatStaticData.currentUser = {username: username};
        scope.username = username;
        that.applyChanges();
    };

    this.isLogged = function(){
        return scope._chatStaticData.currentUser != null;
    };

    this.applyChanges();
}