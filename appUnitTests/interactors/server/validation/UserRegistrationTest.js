describe('UserRegistration', function(){
    beforeEach(function(){
        var that = this;


        this.username = 'username';
        this.usernameExists = 'username2';

        this.password = 'password';

        this.email = 'email@email.email';
        this.emailWrong = 'wrongEmail';

        this.getUserByUsername = function(user){
            return Promise.resolve();
        };

        this.getUserByUsernameExists = function(user){
            return Promise.resolve(new User('username2', 'password'));
        };

        this.validateUserRegistrationForm = function(user){
            return new ValidateError(['username', 'password']);
        }

        this.validateUserRegistrationFormError = function(user){
            var result = new ValidateError(['username', 'password']);
            result.username.tooShort = 'tooShort';
            return result;
        }

    });

    it('resolves without argument when user is valid', function(done){
        var that = this;

        this.userRegistration = new UserRegistration(this.getUserByUsername, this.validateUserRegistrationForm);

        this.userRegistration.do(this.username, this.password, this.email)
            .then(function(arg){
                expect(arg).toBe(undefined);
                done();
            })
            .catch(function(err){
                done.fail(err);
            })
    });

    it('rejects with error message when user entity is not valid', function(done){
        var that = this;

        this.userRegistration = new UserRegistration(this.getUserByUsername, this.validateUserRegistrationFormError);

        this.userRegistration.do(this.usernameWrong, this.password, this.email)
            .then(function(){
                done.fail();
            })
            .catch(function(err){
                expect(err).toBe('tooShort');
                done();
            })
    });

    it('rejects with error message when username already exists', function(done){
    	var that = this;

        this.userRegistration = new UserRegistration(this.getUserByUsernameExists, this.validateUserRegistrationForm);

    	this.userRegistration.do(this.usernameExists, this.password, this.email)
        	.then(function(){
        	    done.fail();
        	})
        	.catch(function(err){
                expect(err).toBe('username already exists');
        	    done();
        	})
    });
});