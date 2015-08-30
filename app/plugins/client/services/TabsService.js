function TabsService(controllerProvider){
    var that = this;

    var id = 0;
    function getUniqueId(){
        return id++;
    }

    this.tabs = [];
    var selectedTab = null;

    this.newTab = function(name, htmlContent, mainFunction, room){
        var id = getUniqueId();
        var controllerName = 'controller' + id;
        var controllerContent = '<div ng-controller="' + controllerName + '">' + htmlContent + '</div>';

        controllerProvider.register(controllerName, function($scope, $element){
            mainFunction({id: id, $scope: $scope, $div: $element});
        });
        var tab = new that.Tab(name, id, controllerContent, room);
        that.tabs.push(tab);
        selectedTab = tab;
        return tab;
    };

    this.Tab = function(title, id, content, room){
        this.title = title;
        this.id = id;
        this.content = content;
        this.room = room;

        this.isSelected = function(){
            return this === selectedTab;
        };

        this.isDeletable = function(){
            return this.room !== undefined;
        }
    }

    this.getSelectedTab = function(){
        return selectedTab;
    }

    this.changeTab = function(tab){
        selectedTab = tab;
    };

}