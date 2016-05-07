function TabsController(scope, tabsService, roomsService, chatStaticData){
    Controller.call(this, scope);
    var that = this;

    scope.tabs = tabsService.tabs;

    scope.changeTab = tabsService.changeTab;

    this.newTab = function(name, html, func){
        tabsService.newTab(name, html, func)
        that.applyChanges();
    }

    this.addTab = function(name, id, html){
        var tab = new Tab(name, id, html);

        tabsService.tabs.push(tab);
        tabsService.changeTab(tab);

        that.applyChanges();
    };

    var Tab = tabsService.Tab;

    scope.getSelectedTab = function(){
        return tabsService.selectedTab;
    };

    scope.deleteTab = function(tab){
        for(var i = 0; i < scope.tabs.length; ++i){
            if(scope.tabs[i] === tab){
                var removedTab = scope.tabs.splice(i, 1),
                    client = removedTab[0].room.client,
                    server = removedTab[0].room.server;

                if(client){
                    client.close();

                    delete removedTab[0].room.client;
                }

                if(server){
                    server.close();
                    
                    delete removedTab[0].room.server;
                }

                if(tab.room !== undefined){
                    roomsService.leaveRoom(tab.room.id);

                    if(tabsService.getSelectedTab() === tab){
                        tabsService.changeTab(scope.tabs[0]);
                    }
                    else if(scope.tabs[0] === tab){
                        tabsService.changeTab(null);
                    }

                }

                break;
            }
        }
    };

    scope.isHost = function(tab){
        return (tab.room === undefined ? false : tab.room.host === chatStaticData.currentUser.username);
    };

    scope.isStarted = function(tab){
        return (tab.isStarted);
    };

    scope.startServer = function(tab){

    }

    this.applyChanges();
}