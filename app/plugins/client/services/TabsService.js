function TabsService(scope, controllerProvider, webRTCAdapter){
    Service.call(this, scope);
    var that = this;

    var id = 0;

    function getUniqueId(){
        return id++;
    }

    this.tabs = [];
    var selectedTab = null;

    this.newTab = function(name, htmlContent, app, room){
        var id = room.id;
        var controllerName = 'controller' + id;
        var controllerContent = '<div ng-controller="' + controllerName + '">' + htmlContent + '</div>';

        controllerProvider.register(controllerName, function($scope, $element){
            var webRTCChannel = webRTCAdapter.createDataChannelClient(id);
            app.client({id: id, $scope: $scope, $div: $element, webRTCChannel: webRTCChannel});
        });

        var startServer = function(){
            var usernames = [];
            for(var i = 0; i < room.users.length; ++i){
                usernames.push(room.users[i].username);
            }
            app.server({usernames: usernames, createDataChannel: webRTCAdapter.createDataChannelServer, id: id});
        };

        var tab = new that.Tab(name, id, controllerContent, room, startServer);
        that.tabs.push(tab);
        selectedTab = tab;

        that.applyChanges();
        return tab;
    };

    this.Tab = function(title, id, content, room, startServer){
        this.title = title;
        this.id = id;
        this.content = content;
        this.room = room;
        this.startServer = startServer;

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