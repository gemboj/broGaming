describe('InputReader', function(){
    beforeEach(function(){

        this.element = {
            onkeydown: null
        };

        this.keyboardInputHandler = {
            pressedKey: function(char){

            }
        };

        spyOn(this.keyboardInputHandler, "pressedKey");


        this.inputReader = new InputReader(this.element);
        this.inputReader.registerKeyboardInputHandler(this.keyboardInputHandler);
    });

    it('passes char corresponding to pressed key code to keyboardInputHandler', function(){
        this.element.onkeydown(66);

        expect(this.keyboardInputHandler.pressedKey).toHaveBeenCalledWith("B");

    })
});