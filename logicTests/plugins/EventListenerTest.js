describe("", function () {
    beforeEach(function () {
        this.plugin = new EventListener();
    });

    it('can create events with registerable callbacks', function(){
        var message = 'message';
        var someEvent = this.plugin.createEvent('someEvent', function(cb){
            cb(message);
        });

        var someUC = {};
        someUC.do = function(message){}
        spyOn(someUC, 'do');

        this.plugin.registerOnSomeEvent(someUC.do);
        someEvent();

        expect(someUC.do).toHaveBeenCalledWith(message);
    });
});