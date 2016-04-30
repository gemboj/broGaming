describe('InputReader', function(){
    beforeEach(function(){

        this.element = {
            onkeydown: null
        };

        this.keyboardInputHandler = {
            keyPress: function(char, pressed){

            }
        };

        spyOn(this.keyboardInputHandler, "keyPress");


        this.inputReader = new InputReader(this.element);
        this.inputReader.registerKeyboardInputHandler(this.keyboardInputHandler);
    });

    it('passes char corresponding to pressed key code to keyboardInputHandler', function(){
        this.element.onkeydown({keyCode: 66});

        expect(this.keyboardInputHandler.keyPress).toHaveBeenCalledWith("B", true);

    })
});