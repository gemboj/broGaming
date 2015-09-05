describe('ValidateUser', function(){
    beforeEach(function(){
        var that = this;



        this.getUserByUsername = function(user){
            return Promise.resolve(new User('username2', 'password'));
        }

        this.getUserByUsernameError = function(user){
            return Promise.reject();
        }

    })

    it('resolves with user when user is valid', function(done){
        var that = this;

        this.validateUser = new ValidateUser(this.getUserByUsername);

        this.user = new User('username', 'password');
        this.validateUser.do(this.user)
            .then(function(user){
                expect(user).toBe(that.user);
                done();
            })
            .catch(function(err){
                done.fail(err);
            })
    });

    it('rejects with error message when user entity is not valid', function(done){
        var that = this;

        this.validateUser = new ValidateUser(this.getUserByUsername);

        this.user = new User('us', 'password');
        this.validateUser.do(this.user)
            .then(function(){
                done.fail();
            })
            .catch(function(err){
                expect(err).toBe('invalid user');
                done();
            })
    });

    it('rejects with error message when username already exists', function(done){
    	var that = this;

        this.validateUser = new ValidateUser(this.getUserByUsername);

        this.user = new User('username2', 'password');
    	this.validateUser.do(this.user)
        	.then(function(){
        	    done.fail();
        	})
        	.catch(function(err){
                expect(err).toBe('username already exists');
        	    done();
        	})
    });
});