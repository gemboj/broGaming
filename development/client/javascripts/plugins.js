define([], function (){
var plugins = {};

plugins.EventListener = function(){
    var that = this;

    that.createEvent = function(name, cb){
        var eventCallbacks = [];
        var event = function(){
            cb(function(){
                for(var i = 0; i < eventCallbacks.length; ++i) {
                    eventCallbacks[i].apply(this, arguments);
                }
            });
        };


        that['registerOn' + name[0].toUpperCase() + name.slice(1)] = function(cb){
            eventCallbacks.push(cb)
        };

        return event;
    };
}

return plugins;
});