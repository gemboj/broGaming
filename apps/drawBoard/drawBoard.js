var drawBoard = function(){
    var drawBoard = {};
    drawBoard._canvasId = "#drawBoardCanvas"; 
    drawBoard.mouseDown = false;
    drawBoard.mouse = {x: 0, y: 0};
    drawBoard._context;
    
	drawBoard.getCanvasId = function(){
		return drawBoard._canvasId;
	};
	
    drawBoard.drawPoint = function(x, y, radius, color){
        drawBoard._context.beginPath();
        drawBoard._context.arc(x, y, radius, 0, 2 * Math.PI, false);
        drawBoard._context.fillStyle = color;
        drawBoard._context.fill();
    };
    
    drawBoard.init = function(){
		var canvasJQ = $(drawBoard.getCanvasId());
        var canvas = canvasJQ[0];            
        //var border = canvasJQ.css("border-top-width");
        //var canvasBorder = parseInt(border.substr(0, border.length-2));
        //var rect = canvas.getBoundingClientRect();
		
		canvas.width = canvasJQ.width();
		canvas.height = canvasJQ.height();
		
        drawBoard._context = canvas.getContext("2d");
		
		$(drawBoard.getCanvasId()).on("mousedown", function(event){
			//canvas.width = canvasJQ.width();
			//canvas.height = canvasJQ.height();
			drawBoard.mouseDown = true;
			var parentOffset = $(this).parent().offset(); 
            drawBoard.mouse.x = event.pageX - parentOffset.left;
            drawBoard.mouse.y = event.pageY - parentOffset.top;
            socketHandler.emit("broadcastRoom", {event: "drawPoint", x: drawBoard.mouse.x, y: drawBoard.mouse.y, radius: 3, color: "#FF0000"});
		});
		
       	/*canvas.addEventListener("mousedown", function(event) {
            drawBoard.mouseDown = true;				
            drawBoard.mouse.x = event.clientX - rect.left - canvasBorder;
            drawBoard.mouse.y = event.clientY - rect.top - canvasBorder;
            socketHandler.emit("broadcastRoom", {event: "drawPoint", x: drawBoard.mouse.x, y: drawBoard.mouse.y, radius: 3, color: "#FF0000"});
        }, false);*/
		
        canvas.addEventListener("mouseup", function(event) {
            drawBoard.mouseDown = false;
        }, false);
		
        canvas.addEventListener("mousemove", function(event) {
            if(drawBoard.mouseDown){
				var parentOffset = $(this).parent().offset(); 
				drawBoard.mouse.x = event.pageX - parentOffset.left;
				drawBoard.mouse.y = event.pageY - parentOffset.top;
                socketHandler.emit("broadcastRoom", {event: "drawPoint", x: drawBoard.mouse.x, y: drawBoard.mouse.y, radius: 3, color: "#FF0000"});
            }
        }, false);
		
		socketHandler.addEvents(drawBoard.socketEvents);
    };
	
    drawBoard.socketEvents = {
        drawPoint: function(data){
            drawBoard.drawPoint(data.x, data.y, data.radius, data.color);
        }
    };
    
    drawBoard.init();
    return drawBoard;
}();

//# sourceURL=drawBoard.js