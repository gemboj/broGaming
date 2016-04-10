describe('Scene', function(){
    beforeEach(function(){
        this.scene = new Scene();

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

        this.scene.addObject(this.objectSpy1);
        this.scene.addObject(this.objectSpy2);

        this.scene.addPlayer(this.playerSpy1);
        this.scene.addPlayer(this.playerSpy2);
    });

    it('can serialize objects and players names and positions', function(){
        var currentGameState = this.scene.serialize();

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
    	this.scene.deserializeObject("object1", {position: {}});
    	this.scene.deserializePlayer("player1", {position: {}});

        expect(this.objectSpy1.deserialize).toHaveBeenCalled();
        expect(this.playerSpy1.deserialize).toHaveBeenCalled();
    });

    it('can update all contained object', function(){
        this.scene.updateAll(100);

        expect(this.objectSpy1.update).toHaveBeenCalledWith(100);
        expect(this.objectSpy2.update).toHaveBeenCalledWith(100);
    });
});