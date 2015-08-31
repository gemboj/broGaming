function Service(scope){
    EventListener.call(this);

    this.applyChanges = function(){
        if(!scope.$$phase) {
            scope.$apply();
        }
    }
}