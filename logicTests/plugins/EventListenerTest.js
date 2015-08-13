describe("EventListener", function () {
    beforeEach(function () {
        this.plugin = new EventListener();
    });

    it('can create events with registerable callbacks', function(){
        var message = 'message';
        var someEvent = this.plugin.createEvent('someEvent', function(cb){
            cb(message);
        });

        var someUC = {};
        someUC.do = function(message){
        };
        spyOn(someUC, 'do');

        this.plugin.registerOnSomeEvent(someUC.do);
        someEvent();

        expect(someUC.do).toHaveBeenCalledWith(message);
    });

    it('passes arguments to callback', function(){
        var message = 'sfsdf'
        var someEvent = this.plugin.createEvent('someEvent', function(cb, m){
            cb(m);
        });

        var someUC = {};
        someUC.do = function(error){
        };
        spyOn(someUC, 'do');

        this.plugin.registerOnSomeEvent(someUC.do);
        someEvent(message);

        expect(someUC.do).toHaveBeenCalledWith(message);
    })

    it('accepts additional object parameter as container for registerOn function', function(){
        var message = 'sfsdf';
        var container = {};
        var someEvent = this.plugin.createEvent('someEvent', function(cb, m){
                cb(m);
            },
            container
        );

        var someUC = {};
        someUC.do = function(error){
        };
        spyOn(someUC, 'do');

        container.registerOnSomeEvent(someUC.do);
        someEvent(message);

        expect(someUC.do).toHaveBeenCalledWith(message);
    })
});