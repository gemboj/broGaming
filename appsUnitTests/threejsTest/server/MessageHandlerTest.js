describe('MessageHandler', function(){
    beforeEach(function(){
        this.gameStateSpy = {
            deserializePlayer: function(){}
        };

        spyOn(this.gameStateSpy, "deserializePlayer");

        this.messageHandler = new MessageHandler(this.gameStateSpy);
    });

    it('handles received playerUpdate messages', function(){
        var playerUpdateData = {};

        this.messageHandler.playerUpdate("player1", playerUpdateData);

        expect(this.gameStateSpy.deserializePlayer).toHaveBeenCalledWith("player1", playerUpdateData);
    })
});