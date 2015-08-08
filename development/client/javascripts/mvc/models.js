define(['angular'], function (angular) {
    var scopes = {};

    angular.module('broGaming', [])
        .controller('chatModel', ['$scope', function ($scope) {
            scopes.chatScope = $scope;
        }]);

    return scopes;
});