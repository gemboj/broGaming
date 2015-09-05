describe('Register ', function(){
    beforeEach(function(){
        var that = this;

        this.hash = function(password){
            return Promise.resolve('hash');
        };

        this.validateUser = function(user){
            return Promise.resolve(user);
        };

        this.validateUserNotValid = function(user){
            return Promise.reject('user is not valid');
        };

        this.addUser = function(user){
            return Promise.resolve();
        };

        this.addUserError = function(user){
            return Promise.reject('some db error');
        };
    })

    it('resolves with message after successful register', function(done){
        var that = this;

        this.register = new Register(this.hash, this.validateUser, this.addUser);

        this.register.do('username', 'password')
            .then(function(message){
                expect(message).toBe('registered');
                done();
            })
            .catch(function(err){
                done.fail(err);
            })
    });

    it('rejects with error when user is not valid', function(done){
        var that = this;

        this.register = new Register(this.hash, this.validateUserNotValid, this.addUser);

        this.register.do('username', 'password')
            .then(function(){
                //expect().to();
                done.fail();
            })
            .catch(function(err){
                expect(err).toBe('user is not valid')
                done();
            })
    });

    it('rejects with error when username already exists', function(done){
    	var that = this;

        this.register = new Register(this.hash, this.validateUser, this.addUserError);

    	this.register.do('username', 'password')
                .then(function(){
                    done.fail();
                })
                .catch(function(err){
                    expect(err).toBe('could not register. Try again later.');
                    done();
                })
    });
})