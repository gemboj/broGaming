(function () {
    function DrawBoard(id, container) {//id - unique name used for HTML elements names; container - jQuerry container for this app
        this._canvasId = "#" + id;
        this._peerConnection = null;

        var that = this;
        container.load("./apps/" + this.fileName + "/" + this.fileName + ".html", function(){
            $(that.defaultId).attr("id", id);

            that.mouseDown = false;
            that.mouse = {x: 0, y: 0, previousX: 0, previousY: 0};
            that._context;

            that.init();
        });

        this._onMessage = this.onStartMessage;
    }

    DrawBoard.prototype.defaultId = "#drawBoardCanvas";
    DrawBoard.prototype.fileName = "drawBoard";

    DrawBoard.prototype.init = function () {
        var canvasJQ = $(this._canvasId);
        var canvas = canvasJQ[0];
        //var border = canvasJQ.css("border-top-width");
        //var canvasBorder = parseInt(border.substr(0, border.length-2));
        //var rect = canvas.getBoundingClientRect();

        canvas.width = canvasJQ.width();
        canvas.height = canvasJQ.height();

        this._context = canvas.getContext("2d");


        this.onMouseMove = this.onMouseMoveOffline;
        this.onMouseUp = this.onMouseUpOffline;
        this.onMouseDown = this.onMouseDownOffline;

        var that = this;
        $(this._canvasId).mousedown(function (event) {
            that.mouseDown = true;
            var parentOffset = $(this).parent().offset();
            that.mouse.x = event.pageX - parentOffset.left;
            that.mouse.y = event.pageY - parentOffset.top;
            that.mouse.previousX = that.mouse.x;
            that.mouse.previousY = that.mouse.y;
            that.onMouseDown(event, this);
        });

        $(this._canvasId).mouseup(function (event) {
            that.mouseDown = false;
            that.onMouseUp(event, this);
        });

        $(this._canvasId).mousemove(function (event) {
            if (that.mouseDown) {
                var parentOffset = $(this).parent().offset();
                that.mouse.previousX = that.mouse.x;
                that.mouse.previousY = that.mouse.y;
                that.mouse.x = event.pageX - parentOffset.left;
                that.mouse.y = event.pageY - parentOffset.top;

                that.onMouseMove(event, this);
            }

        });

        //socketHandler.addEvents(this.socketEvents);
    };

    DrawBoard.prototype.onMouseMoveOffline = function(event, element){
        //this.drawPoint(this.mouse.x, this.mouse.y, 3, "#FF0000");
        this.drawPoint(this.mouse.previousX, this.mouse.previousY, 6, "#FF0000");
        this.drawLine(this.mouse.previousX, this.mouse.previousY, this.mouse.x, this.mouse.y, 12, "#FF0000");
    };

    DrawBoard.prototype.onMouseMoveOnline = function(event, element){
        var data = {x: this.mouse.x, y: this.mouse.y, previousX :this.mouse.previousX, previousY: this.mouse.previousY, draw: "drawPoint", width: 6};
        this._peerConnection.sendData(JSON.stringify(data));
        data.draw = "drawLine";
        data.width = 12;
        this._peerConnection.sendData(JSON.stringify(data));
    };

    DrawBoard.prototype.onMouseDownOffline = function(event, element){
        this.drawPoint(this.mouse.x, this.mouse.y, 6, "#FF0000");
    };

    DrawBoard.prototype.onMouseDownOnline = function(event, element){
        var data = {x: this.mouse.x, y: this.mouse.y, draw: "drawPoint", width: 6};
        this._peerConnection.sendData(JSON.stringify(data));
    };

    DrawBoard.prototype.onMouseUpOffline = function(event, element){
        this.drawPoint(this.mouse.x, this.mouse.y, 6, "#FF0000");
    };

    DrawBoard.prototype.onMouseUpOnline = function(event, element){
        var data = {x: this.mouse.x, y: this.mouse.y, draw: "drawPoint", width: 6};
        this._peerConnection.sendData(JSON.stringify(data));
    };

    DrawBoard.prototype.getCanvasId = function () {
        return this._canvasId;
    };

    DrawBoard.prototype.getName = function(){
        return this.fileName;
    };

    DrawBoard.prototype.drawPoint = function (x, y, radius, color) {
        this._context.beginPath();
        this._context.arc(x, y, radius, 0, 2 * Math.PI, false);
        this._context.fillStyle = color;
        this._context.fill();
    };

    DrawBoard.prototype.drawLine = function (x, y, x2, y2, width, color) {
        this._context.beginPath();
        this._context.moveTo(x,y);
        this._context.lineTo(x2,y2);
        this._context.strokeStyle = color;
        this._context.lineWidth = width;
        this._context.stroke();
    };

    //abstract
    DrawBoard.prototype.stop = function(){

    };

    DrawBoard.prototype.onConnectionOpen = function(){
        //this.onMouseMove = this.onMouseMoveOnline;
        //this.onMouseUp = this.onMouseUpOnline;
        //this.onMouseDown = this.onMouseDownOnline;
    };

    DrawBoard.prototype.onConnectionClose = function(){
        this.onMouseMove = this.onMouseMoveOffline;
        this.onMouseUp = this.onMouseUpOffline;
        this.onMouseDown = this.onMouseDownOffline;
    };

    DrawBoard.prototype.onMessage = function(_data){
        this._onMessage(_data);
        //chatInterface.log.append("webrtcData", data.data);
    };

    DrawBoard.prototype.receivedData = function(_data){
        var data = JSON.parse(_data.data);
        if(data.draw == "drawPoint"){
            this.drawPoint(data.x, data.y, data.width, "#FF0000");
        }
        else{
            this.drawLine(data.previousX, data.previousY ,data.x, data.y, data.width, "#FF0000");
        }

        //chatInterface.log.append("webrtcData", data.data);
    };

    DrawBoard.prototype.onStartMessage = function(_data){
        if(_data.data === "startApp"){
            this._onMessage = this.receivedData;

            this.onMouseMove = this.onMouseMoveOnline;
            this.onMouseUp = this.onMouseUpOnline;
            this.onMouseDown = this.onMouseDownOnline;
        }
    };

    DrawBoard.prototype.readyCheck = function(senderNick, roomId){
        if(this._peerConnection = webrtcAdapter.createConnection(senderNick, roomId, false)){
            this._peerConnection.setEventContext(this);
            this._peerConnection.setOnOpen(this.onConnectionOpen);
            this._peerConnection.setOnClose(this.onConnectionClose);
            this._peerConnection.setOnMessage(this.onMessage);

            return 1;
        }
        else{
            return 0;
        }

    };

    DrawBoard.prototype.setRemoteDescription = function(sessionDescription){
        this._peerConnection.setRemoteDescription(sessionDescription);
        this._peerConnection.createAnswer();
    };

    DrawBoard.prototype.onIceCandidate = function(iceCandidate){
        this._peerConnection.addIceCandidate(iceCandidate);
    };

    appLoader.addConstructor("drawBoard", DrawBoard);
})();