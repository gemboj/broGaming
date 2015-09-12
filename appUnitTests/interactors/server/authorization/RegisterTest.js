describe('Register ', function(){
    beforeEach(function(){
        var that = this;

        this.hash = function(password){
            return Promise.resolve('hash');
        };

        this.validateUser = function(user){
            return Promise.resolve(user);
        };

        this.validateUserFail = function(user){
            return Promise.reject('user is not valid');
        };

        this.addUser = function(user){
            return Promise.resolve();
        };

        this.addUserError = function(user){
            return Promise.reject('some db error');
        };

        this.sendMail = function(to, message){
            return Promise.resolve();
        }

        this.sendMailError = function(to, message){
            return Promise.reject('mail error');
        }

        this.setActivationLink = function(){
            return Promise.resolve();
        }

        this.generaeRandomBytes = function(){
            return Promise.resolve('123253436');
        }
    })

    it('resolves with message after successful register', function(done){
        var that = this;

        this.register = new Register(this.hash, this.validateUser, this.addUser, this.sendMail, this.setActivationLink, this.generaeRandomBytes, 'address');

        this.register.do('username', 'password', 'email')
            .then(function(message){
                expect(message).toBe('registered');
                done();
            })
            .catch(function(err){
                done.fail(err);
            })
    });

    it('rejects with validation error when validation fails', function(done){
        var that = this;

        this.register = new Register(this.hash, this.validateUserFail, this.addUser, this.sendMail, this.setActivationLink, this.generaeRandomBytes, 'address');

        this.register.do('username', 'password', 'email')
            .then(function(){
                //expect().to();
                done.fail();
            })
            .catch(function(err){
                expect(err).toBe('user is not valid')
                done();
            })
    });

    it('rejects with db error when adding user fails', function(done){
    	var that = this;

        this.register = new Register(this.hash, this.validateUser, this.addUserError, this.sendMail, this.setActivationLink, this.generaeRandomBytes, 'address');

    	this.register.do('username', 'password', 'email')
        	.then(function(){
        	    done.fail();
        	})
        	.catch(function(err){
                expect(err).toBe('registration failed. Please try again later.');
        	    done();
        	})
    });

    it('rejects with email error when sending email fails', function(done){
        var that = this;

        this.register = new Register(this.hash, this.validateUser, this.addUser, this.sendMailError, this.setActivationLink, this.generaeRandomBytes, 'address');

        this.register.do('username', 'password', 'email')
            .then(function(){
                done.fail();
            })
            .catch(function(err){
                expect(err).toBe('registration failed. Please try again later.');
                done();
            })
    });
})