function TabsService(scope, controllerProvider, webRTCAdapter, messageLogService){
    Service.call(this, scope);
    var that = this;

    var id = 0;

    function getUniqueId(){
        return id++;
    }

    this.tabs = [];
    var selectedTab = null;

    this.newTab = function(name, htmlContent, client, server, room){
        var id = room.id;
        var controllerName = 'controller' + id;
        var controllerContent = '<div ng-controller="' + controllerName + '">' + htmlContent + '</div>';

        controllerProvider.register(controllerName, function($scope, $element){
            var webRTCChannel = null;
            try{
                webRTCChannel = webRTCAdapter.createDataChannelClient(id);
            }
            catch(e){
                messageLogService.showError(e.error);
                webRTCChannel = e.webRTCChannel;
            }
            finally{
                client.main({
                    id: id,
                    $scope: $scope,
                    $div: $element,
                    webRTCChannel: webRTCChannel,
                    showInfo: messageLogService.showInfo,
                    showError: messageLogService.showError
                });
            }

        });

        var startServer = function(){
            var usernames = [];
            for(var i = 0; i < room.users.length; ++i){
                usernames.push(room.users[i].username);
            }
            server.main({usernames: usernames, createDataChannel: webRTCAdapter.createDataChannelServer, id: id, showInfo: messageLogService.showInfo, showError: messageLogService.showError});
        };

        var tab = new that.Tab(name, id, controllerContent, room, startServer);
        that.tabs.push(tab);
        selectedTab = tab;

        that.applyChanges();
        return tab;
    };

    this.Tab = function(title, id, content, room, startServer){
        var that = this;

        this.title = title;
        this.id = id;
        this.content = content;
        this.room = room;

        this.isStarted = false;
        this.isSelected = function(){
            return this === selectedTab;
        };

        this.isDeletable = function(){
            return this.room !== undefined;
        }

        this.startServer = function(){
            startServer();
            that.isStarted = true;
        };
    }

    this.getSelectedTab = function(){
        return selectedTab;
    }

    this.changeTab = function(tab){
        selectedTab = tab;
    };

}