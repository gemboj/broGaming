describe('GameState', function(){
    beforeEach(function(){
        //spyOn(this, 'send').and.callThrough();
        this.gameState = new GameState();

        this.objectSpy = {getName: function(){return "object1"}, getPosition: function(){return {x: 2, y: 0, z: 1}}, setPosition: function(){}};
        this.objectSpy2 = {getName: function(){return "object2"}, getPosition: function(){return {x: 4, y: 1, z: 2}}};

        spyOn(this.objectSpy, "setPosition");

        this.gameState.addObject(this.objectSpy);
        this.gameState.addObject(this.objectSpy2);
    });

    it('can serialize objects names and positions', function(){
        var currentGameState = this.gameState.serialize();

        expect(currentGameState.objects.object1.position).toEqual({x: 2, y: 0, z: 1});
        expect(currentGameState.objects.object1.name).toEqual("object1");
        expect(currentGameState.objects.object2.position).toEqual({x: 4, y: 1, z: 2});
        expect(currentGameState.objects.object2.name).toEqual("object2");
    });

    xit('updates object based on JSON formatted specification', function(){
    	var that = this;

    	this.gameState.updateObject({name: "object1", position: {x: -5, y: 2, z: 6}});

        expect(this.objectSpy.setPosition).toHaveBeenCalled();
    });

});