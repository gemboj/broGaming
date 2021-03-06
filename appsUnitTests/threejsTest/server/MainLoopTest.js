describe('MainLoop', function(){
    beforeEach(function(){
        this.gameStateSpy = {
            update: function(){},
            serialize: function(){}
        };

        this.broadcastSpy = function(){

        };

        spyOn(this.gameStateSpy, "serialize");
        spyOn(this.gameStateSpy, "update");
        spyOn(this, "broadcastSpy");

        this.loopInterval = 20;
        this.testDuration = 100;
        this.loopCount = this.testDuration / this.loopInterval;
        this.mainLoop = new MainLoop(this.gameStateSpy, this.broadcastSpy, this.loopInterval);
    });

    it('will update all objects on scene, serialize and broadcast result', function(done){
        var that = this;

        this.mainLoop.start();

        setTimeout(function(){
            that.mainLoop.stop();


            var callsCount = that.gameStateSpy.serialize.calls.count();
            expect(callsCount).toBeGreaterThan(that.loopCount - 1);
            expect(that.broadcastSpy.calls.count()).toEqual(callsCount);

            var updateTime = that.gameStateSpy.update.calls.argsFor(that.gameStateSpy.update.calls.count() - 1);
            expect(updateTime).toBeGreaterThan(that.loopInterval - 10);
            expect(updateTime).toBeLessThan(that.loopInterval + 10);

            setTimeout(function(){
                expect(that.gameStateSpy.serialize.calls.count()).toEqual(callsCount);
                done();
            }, that.testDuration);
        }, that.testDuration);
    })
});