describe('GameState', function(){
    beforeEach(function(){
        this.gameState = new GameState();

        this.objectSpy1 = {
            getId: function(){return "object1"},
            serialize: function(){return {}},
            deserialize: function(){},
            update: function(){}
        };
        this.objectSpy2 = {
            getId: function(){return "object2"},
            serialize: function(){return {}},
            deserialize: function(){},
            update: function(){}
        };

        this.playerSpy1 = {
            getId: function(){return "player1"},
            serialize: function(){return {}},
            deserialize: function(){},
            update: function(){}
        };

        this.playerSpy2 = {
            getId: function(){return "player2"},
            serialize: function(){return {}},
            deserialize: function(){},
            update: function(){}
        };

        spyOn(this.objectSpy1, "deserialize");
        spyOn(this.playerSpy1, "deserialize");

        spyOn(this.objectSpy1, "update");
        spyOn(this.objectSpy2, "update");

        spyOn(this.objectSpy1, "serialize").and.callThrough();
        spyOn(this.objectSpy2, "serialize").and.callThrough();
        spyOn(this.playerSpy1, "serialize").and.callThrough();
        spyOn(this.playerSpy2, "serialize").and.callThrough();

        this.gameState.addObject(this.objectSpy1);
        this.gameState.addObject(this.objectSpy2);

        this.gameState.addPlayer(this.playerSpy1);
        this.gameState.addPlayer(this.playerSpy2);
    });

    it('can serialize objects and players names and positions', function(){
        var currentGameState = this.gameState.serialize();

        expect(this.objectSpy1.serialize).toHaveBeenCalled();
        expect(this.objectSpy2.serialize).toHaveBeenCalled();

        expect(this.playerSpy1.serialize).toHaveBeenCalled();
        expect(this.playerSpy2.serialize).toHaveBeenCalled();

        expect(currentGameState.objects.object1).not.toBe(undefined);
        expect(currentGameState.objects.object2).not.toBe(undefined);
        expect(currentGameState.players.player1).not.toBe(undefined);
        expect(currentGameState.players.player2).not.toBe(undefined);
    });

    it('updates object and player based on given specification', function(){
    	this.gameState.deserializeObject("object1", {position: {}});
    	this.gameState.deserializePlayer("player1", {position: {}});

        expect(this.objectSpy1.deserialize).toHaveBeenCalled();
        expect(this.playerSpy1.deserialize).toHaveBeenCalled();
    });

    it('can update all contained object', function(){
        this.gameState.updateAll(100);

        expect(this.objectSpy1.update).toHaveBeenCalledWith(100);
        expect(this.objectSpy2.update).toHaveBeenCalledWith(100);
    });
});