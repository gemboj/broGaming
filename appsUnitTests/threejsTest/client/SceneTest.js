describe('Scene', function(){
    beforeEach(function(){
        this.scene = new Scene();

        this.objectSpy1 = {
            getId: function(){return "object1"},
            deserialize: function(){}
        };
        this.objectSpy2 = {
            getId: function(){return "object2"},
            deserialize: function(){}
        };

        this.playerSpy1 = {
            getId: function(){return "player1"},
            deserialize: function(){}
        };

        this.playerSpy2 = {
            getId: function(){return "player2"},
            deserialize: function(){}
        };

        spyOn(this.objectSpy1, "deserialize").and.callThrough();
        spyOn(this.objectSpy2, "deserialize").and.callThrough();
        spyOn(this.playerSpy1, "deserialize").and.callThrough();
        spyOn(this.playerSpy2, "deserialize").and.callThrough();

        this.scene.addObject(this.objectSpy1);
        this.scene.addObject(this.objectSpy2);

        this.scene.addPlayer(this.playerSpy1);
        this.scene.addPlayer(this.playerSpy2);
    });

    it('updates objects and players based on given specification', function(){
        this.scene.update({
            players: {
                player1: {},
                player2: {}
            },
            objects: {
                object1: {},
                object2: {}
            }
        });

        expect(this.playerSpy1.deserialize).toHaveBeenCalled();
        expect(this.playerSpy2.deserialize).toHaveBeenCalled();
        expect(this.objectSpy1.deserialize).toHaveBeenCalled();
        expect(this.objectSpy2.deserialize).toHaveBeenCalled();

    });
});