function Controller(scope){
    EventListener.call(this);

    this.applyChanges = function(){
        if(!scope.$$phase) {
            scope.$apply();
        }
    }
}