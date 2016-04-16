function InputReader(element){
    this.element = element;
}

InputReader.prototype.registerKeyboardInputHandler = function(inputHandler){
    this.element.onkeydown = function(e){
        var char = String.fromCharCode(e.keyCode);
        inputHandler.keyPress(char, true);
    }

    this.element.onkeyup = function(e){
        var char = String.fromCharCode(e.keyCode);

        inputHandler.keyPress(char, false);
    }
};