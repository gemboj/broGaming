define([], function (){
    var o = {};


    o.client = function(input){//id, $div, $scope
        var scope = input.$scope;

        scope.costam = 0;
        scope.cos = function(){
            scope.costam++;
        }
    }

    o.server = function(){
        console.log('starting server');
    }

    return o;
});