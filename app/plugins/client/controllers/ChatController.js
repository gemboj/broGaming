function ChatController(scope){
    EventListener.call(this);
    var that = this;

    scope.message = 'gemboj';
    scope.login = '';
    scope.error = '';
    scope.messageLog = '';

    scope.rooms = [
        {
            id: 'id1',
            name: 'name1',
            users: [
                'nick1',
                'nick2'
            ]
        }
    ];

    scope.users = [];


    var mainTab = new Tab('tab1');
    var selectedTab = mainTab;

    scope.tabs = [
        mainTab,
        new Tab('tab2')
    ];

    function Tab(title){
        this.title = title;

        this.isSelected = function(){
            return this === selectedTab;
        };
    };

    scope.switchTab = function(tab){
        selectedTab = tab;
        applyChanges();
    };

    scope.sendMessage = that.createEvent('sendMessage', function(action){
        action(function(listener){
            listener(scope.message);
        });
    });

    scope.connect = that.createEvent('connect', function (action) {
        action(function (listener) {
            listener({username: scope.message, password: 'a'});
        });
    });

    that.showLogin = function(username){
        scope.messageLog += 'Logged as: ' + username + '\n';
        //scope.login = username;
        applyChanges()
    };

    that.showError = function(error){
        //scope.error = error;
        scope.messageLog += 'Error: ' + error + '\n';
        applyChanges()
    };

    var applyChanges = function(){
        if(!scope.$$phase) {
            scope.$apply();
        }
    }
}

ChatController.prototype = Object.create(EventListener);