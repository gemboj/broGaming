function RegisterController(scope, userRegisterFormValidate){
    Controller.call(this, scope);
    var that = this;

    scope.email = '';
    scope.username = '';
    scope.password = '';

    scope.emailRegisterError = '';
    scope.usernameRegisterError = '';
    scope.passwordRegisterError = '';

    scope.validateRegister = function(field){
        var result = userRegisterFormValidate(scope.username, scope.password, scope.email);

        if(field === undefined){
            var usernameError = result.getError('username');
            scope['usernameRegisterError'] = usernameError;
            scope.registerForm.username.$setValidity('valid', usernameError === '');

            var passwordError = result.getError('password');
            scope['passwordRegisterError'] = passwordError;
            scope.registerForm.password.$setValidity('valid', passwordError === '');

            var emailError = result.getError('email');
            scope['emailRegisterError'] = emailError;
            scope.registerForm.password.$setValidity('valid', emailError === '');
        }
        else{
            var error = result.getError(field);
            scope[field + 'RegisterError'] = error;
            scope.registerForm[field].$setValidity('valid', error === '');
        }

        return result.getError() === '';
    };

    scope.register = that.createEvent('register', function(action){
        if(scope.validateRegister()){
            action(function(listener){
                listener(scope.username, scope.password, scope.email);
            });
        }
    });

    this.showRegisterMessage = function(message){
        messageLogService.showInfo(message);
    };
}