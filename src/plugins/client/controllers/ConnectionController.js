function ConnectionController(scope, chatStaticData, userLoginFormValidate, userRegisterFormValidate){
    Controller.call(this, scope);
    var that = this;

    scope.username = 'gemboj';
    scope.password = 'password';

    scope.usernameLoginError = '';
    scope.passwordLoginError = '';

    scope.validateLogin = function(field){
        var result = userLoginFormValidate(scope.username, scope.password);

        if(field === undefined){
            var usernameError = result.getError('username');
            scope['usernameLoginError'] = usernameError;
            scope.loginForm.username.$setValidity('valid', usernameError === '');

            var passwordError = result.getError('password');
            scope['passwordLoginError'] = passwordError;
            scope.loginForm.password.$setValidity('valid', passwordError === '');
        }
        else{
            var error = result.getError(field);
            scope[field + 'LoginError'] = error;
            scope.loginForm[field].$setValidity('valid', error === '');
        }

        return result.getError() === '';
    };

    scope.connect = that.createEvent('connect', function (action) {
        if(scope.validateLogin()){
            action(function(listener){
                listener({username: scope.username, password: scope.password});
            });
        }
        else{
            scope.validateLogin();
        }
    });

    this.saveCurrentUser = function(username){
        chatStaticData.currentUser = {username: username};
        scope.username = username;
        that.applyChanges();
    };

    this.isLogged = function(){
        return chatStaticData.currentUser != null;
    };

    scope.isConnected = function(){
        return chatStaticData.currentUser !== null;
    };

    this.applyChanges();
}