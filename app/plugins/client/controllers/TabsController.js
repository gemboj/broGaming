function TabsController(scope){
    Controller.call(this, scope);
    var that = this;

    var mainTab = new Tab('tab1', 'home');
    scope.selectedTab = mainTab;

    scope.tabs = [
        mainTab,
        new Tab('tab2', 'apps'),
        new Tab('tab3', 'canvas')
    ];

    scope.changeTab = function(tab){
        scope.selectedTab = tab;
    };

    function Tab(title, url){
        this.title = title;
        this.url = url;

        this.isSelected = function(){
            return this === scope.selectedTab;
        };
    };

    this.applyChanges();
}