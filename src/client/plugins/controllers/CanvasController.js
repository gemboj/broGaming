function CanvasController(scope){
    Controller.call(this, scope);
    var that = this;




    scope.draw = function(){
        var c = scope._element.find("canvas")[0];
        var ctx = c.getContext("2d");

        var r = ~~(Math.random() * 255),
            g = ~~(Math.random() * 255),
            b = ~~(Math.random() * 255);
        ctx.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")";
        ctx.fillRect(0,0,150,75);
    };


    that.showMessage = function(message){
        scope.messageLog += message;
        this.applyChanges();
    };
}