define([], function(){
    return function(){
        setInterval(function(){
            console.log("test client");
        }, 1000)
    };
});