var plugins = {};


plugins.EventListener = function(){
    var that = this;

    that.createEvent = function(name, cb, context){
        var eventCallbacks = [];
        var event = function(){
            var args = [function(){
                var cbArguments = [];
                for(arg in arguments){
                    cbArguments.push(arguments[arg]);
                }
                for(var i = 0; i < eventCallbacks.length; ++i) {
                    eventCallbacks[i].apply(this, cbArguments);
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

module.exports = plugins;