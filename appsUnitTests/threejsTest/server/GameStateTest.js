describe('GameState', function(){
    beforeEach(function(){
        this.communicator = {
            messageHandler: null,
            registerMessageHandler: function(handler){
                this.messageHandler = handler
            },
            broadcast: function(){}
        };

        this.mainLoopSpy = {
            start: function(){}
        };

        this.sceneSpy = {
            updatePlayer: function(){}
        };

        spyOn(this.mainLoopSpy, "start");
        spyOn(this.sceneSpy, "updatePlayer");

        this.gameState = new GameState(["playerA", "playerB"], this.communicator, this.mainLoopSpy, this.sceneSpy);
    });

    it('starts when all players connect', function(){
        this.communicator.messageHandler.playerConnected("playerA");
        expect(this.mainLoopSpy.start).not.toHaveBeenCalled();

        this.communicator.messageHandler.playerConnected("playerB");
        expect(this.mainLoopSpy.start).toHaveBeenCalled();
    });

    it('removes gameObject from state when connection error occures', function(){
        this.communicator.messageHandler.connectionError("playerA");
        expect(this.mainLoopSpy.start).not.toHaveBeenCalled();

        this.communicator.messageHandler.playerConnected("playerB");
        expect(this.mainLoopSpy.start).toHaveBeenCalled();
    });

    it('updates gameObject on scene when receiving gameObject update', function(){
    	var that = this,
            updateData = {};

        this.communicator.messageHandler.updatePlayer("playerA", updateData);
        expect(this.sceneSpy.updatePlayer).toHaveBeenCalledWith("playerA", updateData);
    });
});