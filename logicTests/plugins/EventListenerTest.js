describe("EventListener", function () {
    beforeEach(function () {
        this.someUC = {};
        this.someUC.do = function(message){
        };
        spyOn(this.someUC, 'do');

        this.plugin = new EventListener();
    });

    it('creates registerOn Event function as object method', function(){
        this.plugin.createEvent('someEvent', function(){
        });

        expect(this.plugin.registerOnSomeEvent).not.toBe(undefined);
        expect({}.toString.call(this.plugin.registerOnSomeEvent)).toBe('[object Function]');
    });

    it('returns function used to fire event', function(){
        var someEvent = this.plugin.createEvent('someEvent', function(){

        });

        expect(someEvent).not.toBe(undefined);
        expect({}.toString.call(someEvent)).toBe('[object Function]');
    });

    it('gives a callback that can be used do define action to happen for listeners', function(){
        var message = 'message';
        var someEvent = this.plugin.createEvent('someEvent', function(action){
            action(function(listener){
                listener(message);
            });
        });

        this.plugin.registerOnSomeEvent(this.someUC.do);

        //event happens
        someEvent();

        expect(this.someUC.do).toHaveBeenCalledWith(message);
    });

    it('passes event argument to callback', function(){
        var message = 'sfsdf'
        var someEvent = this.plugin.createEvent('someEvent', function(action, m){
            action(function(listener){
                listener(m);
            });
        });

        this.plugin.registerOnSomeEvent(this.someUC.do);
        someEvent(message);

        expect(this.someUC.do).toHaveBeenCalledWith(message);
    });

    it('passes multiply event arguments to callback', function(){
        var message1 = 'sfsdf1';
        var message2 = 'sfsdf2';
        var message3 = 'sfsdf3';

        var someEvent = this.plugin.createEvent('someEvent', function(action, m1, m2, m3){
            action(function(listener){
                listener(m1, m2, m3);
            });
        });

        this.plugin.registerOnSomeEvent(this.someUC.do);
        someEvent(message1, message2, message3);

        expect(this.someUC.do).toHaveBeenCalledWith(message1, message2, message3);
    });

    it('accepts additional object parameter as container for registerOn function', function(){
        var message = 'sfsdf';
        var container = {};
        var someEvent = this.plugin.createEvent('someEvent', function(action){
                action(function(listener){
                    listener(message);
                });
            },
            container
        );

        container.registerOnSomeEvent(this.someUC.do);
        someEvent(message);

        expect(this.someUC.do).toHaveBeenCalledWith(message);
    });

    it('calls action for every registered listener', function(){
        var that = this;
        that.forListener = function(listener){
            listener();
        };
        spyOn(this, 'forListener').and.callThrough();


        var someEvent = this.plugin.createEvent('someEvent', function(action){
                action(that.forListener);
            }
        );

        this.plugin.registerOnSomeEvent(this.someUC.do);
        this.plugin.registerOnSomeEvent(this.someUC.do);
        this.plugin.registerOnSomeEvent(this.someUC.do);
        someEvent();

        expect(this.forListener.calls.count()).toBe(3);
    });

    it('calls functions before listeners only once', function(){
        var that = this;
        that.beforeListeners = function(){
            //do some work here
        };
        spyOn(this, 'beforeListeners').and.callThrough();


        var someEvent = this.plugin.createEvent('someEvent', function(action){
                that.beforeListeners();
                action(function(listener){
                    listener();
                });
            }
        );

        this.plugin.registerOnSomeEvent(this.someUC.do);
        this.plugin.registerOnSomeEvent(this.someUC.do);
        this.plugin.registerOnSomeEvent(this.someUC.do);
        someEvent();

        expect(this.beforeListeners.calls.count()).toBe(1);
    })
});