function TabsController(scope){
    Controller.call(this, scope);
    var that = this;

    var id = 0;
    function getUniqueId(){
        return id++;
    }

    var mainTab = new Tab('home1', 'home1', '<div id="chatCon" class="tab selected" ng-controller="connectionController">cos</div>', 'connectionController');
    var mainTab2 = new Tab('home2', 'home2', '<div ng-controller="connectionController"><p ng-bind="costam"></p><button ng-click="cos()">Cos</button></div>', 'connectionController');
    scope.selectedTab = mainTab;

    scope.tabs = [
        mainTab,
        mainTab2,
        new Tab('apps1', 'apps1', '<div ng-controller="appsController">tab 2 content</div>', 'appsController'),
        new Tab('canvas1', 'canvas1', '<div ng-controller="canvasController"><canvas id="canvas"></canvas><button ng-click="draw()">Draw</button></div>', 'canvasController'),
        new Tab('canvas2', 'canvas2', '<div ng-controller="canvasController"><canvas id="canvas"></canvas><button ng-click="draw()">Draw</button></div>', 'canvasController')
    ];

    scope.changeTab = function(tab){
        scope.selectedTab = tab;
    };

    this.newTab = function(name, htmlContent, mainFunction){
        var id = getUniqueId();
        var controllerName = 'controller' + id;
        var controllerContent = '<div ng-controller="' + controllerName + '">' + htmlContent + '</div>';

        /*var app = angular.module('someApp', []).config(function($sceProvider) {
            // Completely disable SCE.  For demonstration purposes only!
            // Do not use in new projects.
            $sceProvider.enabled(false);
        });*/

        scope._controllerProvider.register(controllerName, function($scope, $element){
            mainFunction({id: id, $scope: $scope, $div: $element});
        });

        //angular.bootstrap(document, ['someApp']);
        scope.tabs.push(new Tab(name, id, controllerContent, controllerName));
        that.applyChanges();
    };

    function Tab(title, id, content, controller){
        this.title = title;
        this.id = id;
        this.content = content;
        this.controller = controller;

        this.isSelected = function(){
            return this === scope.selectedTab;
        };

        this.getController = function(){
            return this.controller;
        }
    };

    this.applyChanges();
}