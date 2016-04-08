describe('GameState', function(){
    beforeEach(function(){
        this.gameState = new GameState();

        this.objectSpy1 = {
            getId: function(){return "object1"},
            getPosition: function(){
                return {
                    serialize: function(){return {x: 2, y: 0, z: 1}},
                };

            },
            setPosition: function(){},
            update: function(){}
        };
        this.objectSpy2 = {
            getId: function(){return "object2"},
            getPosition: function(){
                return {
                    serialize: function(){return {x: 4, y: 2, z: 2}},
                };
            },
            setPosition: function(){},
            update: function(){}
        };

        this.playerSpy1 = {
            getId: function(){return "player1"},
            getPosition: function(){
                return {
                    serialize: function(){return {x: 2, y: 0, z: 1}},
                };

            },
            setPosition: function(){},
            update: function(){}
        };

        this.playerSpy2 = {
            getId: function(){return "player2"},
            getPosition: function(){
                return {
                    serialize: function(){return {x: 4, y: 2, z: 2}},
                };
            },
            setPosition: function(){},
            update: function(){}
        };

        spyOn(this.objectSpy1, "setPosition");
        spyOn(this.playerSpy1, "setPosition");

        spyOn(this.objectSpy1, "update");
        spyOn(this.objectSpy2, "update");

        this.gameState.addObject(this.objectSpy1);
        this.gameState.addObject(this.objectSpy2);

        this.gameState.addPlayer(this.playerSpy1);
        this.gameState.addPlayer(this.playerSpy2);
    });

    it('can serialize objects and players names and positions', function(){
        var currentGameState = this.gameState.serialize();

        expect(currentGameState.objects.object1.position).toEqual({x: 2, y: 0, z: 1});
        expect(currentGameState.objects.object1.id).toEqual("object1");
        expect(currentGameState.objects.object2.position).toEqual({x: 4, y: 2, z: 2});
        expect(currentGameState.objects.object2.id).toEqual("object2");

        expect(currentGameState.players.player1.position).toEqual({x: 2, y: 0, z: 1});
        expect(currentGameState.players.player1.id).toEqual("player1");
        expect(currentGameState.players.player2.position).toEqual({x: 4, y: 2, z: 2});
        expect(currentGameState.players.player2.id).toEqual("player2");
    });

    it('updates object and player based on given specification', function(){
    	this.gameState.updateObject({id: "object1", position: {}});
    	this.gameState.updatePlayer({id: "player1", position: {}});

        expect(this.objectSpy1.setPosition).toHaveBeenCalled();
        expect(this.playerSpy1.setPosition).toHaveBeenCalled();
    });

    it('can update all contained object', function(){
        this.gameState.updateAll();

        expect(this.objectSpy1.update).toHaveBeenCalled();
        expect(this.objectSpy2.update).toHaveBeenCalled();
    });
});