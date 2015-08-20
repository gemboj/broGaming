function CanvasController(scope){
    Controller.call(this, scope);
    var that = this;




    scope.draw = function(){
        var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(0,0,150,75);
    };


    that.showMessage = function(message){
        scope.messageLog += message;
        this.applyChanges();
    };
}