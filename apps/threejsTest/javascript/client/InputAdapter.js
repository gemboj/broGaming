function InputAdapter(inputReader, clientState){
    this.clientState = clientState;

    inputReader.registerKeyboardInputHandler(this);
}

InputAdapter.prototype.keyPress = function(char, isPressed){
    console.log(char);
    switch(char.toLowerCase()){
        case 'a':
            this.clientState.move("left", isPressed);
            break;
        case 'd':
            this.clientState.move("right", isPressed);
            break;
        case 's':
            this.clientState.move("down", isPressed);
            break;
        case 'w':
            this.clientState.move("up", isPressed);
            break;
    }
};