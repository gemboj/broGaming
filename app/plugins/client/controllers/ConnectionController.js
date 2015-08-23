function ConnectionController(scope){
    Controller.call(this, scope);
    var that = this;

    scope.username = '';
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

    //this.applyChanges();
}