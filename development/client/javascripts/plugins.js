define([], function (){
var plugins = {};

plugins.EventListener = function(){
    var that = this;

    that.createEvent = function(name, cb, context){
        var eventCallbacks = [];
        var event = function(){
            var args = [function(forListener){
                for(var i = 0; i < eventCallbacks.length; ++i) {
                    forListener(eventCallbacks[i]);
                }
            }];

            for(arg in arguments){
                args.push(arguments[arg]);
            }

            cb.apply(this, args);
        };

        var targetContext = (context === undefined ? that : context);
        targetContext['registerOn' + name[0].toUpperCase() + name.slice(1)] = function(cb){
            eventCallbacks.push(cb)
        };

        return event;
    };
}

return plugins;
});