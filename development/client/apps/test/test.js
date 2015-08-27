define([], function (){

    function test(input){//id, $div, $scope
        var scope = input.$scope;

        scope.costam = 0;
        scope.cos = function(){
            scope.costam++;
        }
    }

    return test;
});