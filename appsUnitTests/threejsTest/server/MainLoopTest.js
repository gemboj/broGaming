describe('MainLoop', function(){
    beforeEach(function(){
        this.gameStateSpy = {
            serialize: function(){}
        };

        this.broadcastSpy = function(){

        };

        spyOn(this.gameStateSpy, "serialize");
        spyOn(this, "broadcastSpy");

        this.mainLoop = new MainLoop(this.gameStateSpy, this.broadcastSpy);
    });

    it('will update all objects on scene, serialize and broadcast result', function(done){
        var that = this;

        this.mainLoop.start();

        setTimeout(function(){
            that.mainLoop.stop();


            var callsCount = that.gameStateSpy.serialize.calls.count();
            expect(callsCount).toBeGreaterThan(5);

            setTimeout(function(){
                expect(that.gameStateSpy.serialize.calls.count()).toEqual(callsCount);
                done();
            }, 100);
        }, 100);
    })
});