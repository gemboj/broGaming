function TabsController(scope){
    Controller.call(this, scope);
    var that = this;

    var mainTab = new Tab('home1', 'home1', '<div id="chatCon" class="tab selected" ng-controller="connectionController"><form ng-submit="connect()" class="flexContainerH"> <input type="text" ng-model="username"/><input type="text" ng-model="password"/><input type="submit" value="Connect" class="button"/></form></div>', 'connectionController');
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