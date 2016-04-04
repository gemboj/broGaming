describe('GameState', function(){
    beforeEach(function(){
        this.gameState = new GameState();

        this.objectSpy = {
            getId: function(){return "object1"},
            getPosition: function(){
                return {
                    serialize: function(){return {x: 2, y: 0, z: 1}},
                };

            },
            setPosition: function(){}
        };
        this.objectSpy2 = {
            getId: function(){return "object2"},
            getPosition: function(){
                return {
                    serialize: function(){return {x: 4, y: 2, z: 2}},
                };
            },
            setPosition: function(){}
        };

        spyOn(this.objectSpy, "setPosition");

        this.gameState.addObject(this.objectSpy);
        this.gameState.addObject(this.objectSpy2);
    });

    it('can serialize objects names and positions', function(){
        var currentGameState = this.gameState.serialize();

        expect(currentGameState.objects.object1.position).toEqual({x: 2, y: 0, z: 1});
        expect(currentGameState.objects.object1.id).toEqual("object1");
        expect(currentGameState.objects.object2.position).toEqual({x: 4, y: 2, z: 2});
        expect(currentGameState.objects.object2.id).toEqual("object2");
    });

    it('updates object based on given specification', function(){
    	this.gameState.updateObject({id: "object1", position: {}});

        expect(this.objectSpy.setPosition).toHaveBeenCalled();
    });

});