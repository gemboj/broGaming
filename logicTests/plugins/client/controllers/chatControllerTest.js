describe("Manages chat GUI", function () {
    beforeEach(function () {
        this.scope = {};
        this.chatController = new chatController(this.scope);

        this.someUC = {};
        this.someUC.do = function(){};

        this.otherUC = {};
        this.otherUC.do = function(){};
    });

    it('can send messages', function(){
        spyOn(this.someUC, 'do');
        this.chatController.registerOnSendMessage(this.someUC.do);

        var message = 'message';
        this.scope.message = message;//user executing sendMessage through UI
        this.scope.sendMessage();

        expect(this.someUC.do).toHaveBeenCalledWith(message);
    });
});