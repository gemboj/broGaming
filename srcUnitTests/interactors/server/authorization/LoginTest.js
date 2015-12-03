describe('Login', function(){
    beforeEach(function(){

        this.getUserByUsername = function(username){
            return Promise.resolve(new User('username', 'hashedPassword', false, true));
        };

        this.getUserByUsernameNoUser = function(user){
            return Promise.resolve(null);
        };

        this.getUserByUsernameWrongUser = function(user){
            return Promise.resolve(new User('username', 'hashedPassword2', false, true));
        };

        this.markUserAsLoggedResolve = function(){
            return Promise.resolve();
        };

        this.markUserAsLoggedReject = function(){
            return Promise.reject('alreadyLogged');
        };

        this.compareHashTrue = function(password, hash){
            return Promise.resolve(true);
        };

        this.compareHashFalse = function(password, hash){
            return Promise.resolve(false);
        };

        spyOn(this, 'markUserAsLoggedResolve').and.callThrough();
        spyOn(this, 'markUserAsLoggedReject').and.callThrough();
    });

    it('it resolves when given credentials matches that in db, user is not already logged and marks user as logged', function(done){
        var that = this,
            login = new Login(this.getUserByUsername, this.markUserAsLoggedResolve, this.compareHashTrue);

        login.do({username: 'username', password: 'password'})
            .then(function(){
                expect(that.markUserAsLoggedResolve).toHaveBeenCalled();

                done();

            })
            .catch(function(err){
                done.fail(err);
            });
    }, 2000);

    it('it rejects with message when user does not exists', function(done){
        var that = this,
            login = new Login(this.getUserByUsernameNoUser, this.markUserAsLoggedResolve, this.compareHashTrue);

        login.do({username: 'username', password: 'password'})
            .then(function(){
                done.fail();
            })
            .catch(function(err){
                expect(that.markUserAsLoggedResolve).not.toHaveBeenCalled();

                expect(err).toBe(login.invalidCredentials);
                done();
            });
    })

    it('it rejects with message when user is already logged in', function(done){
        var that = this,
            login = new Login(this.getUserByUsername, this.markUserAsLoggedReject, this.compareHashTrue);

        login.do({username: 'username', password: 'password'})
            .then(function(){
                done.fail();
            })
            .catch(function(err){
                expect(that.markUserAsLoggedReject).toHaveBeenCalled();

                expect(err).toBe(login.alreadyLogged);
                done();
            });
    })

    it('reject with error message when password does not match', function(done){
        var that = this;

        var login = new Login(this.getUserByUsernameWrongUser, this.markUserAsLoggedResolve, this.compareHashFalse)

        login.do({username: 'username', password: 'password'})
            .then(function(){
                done.fail();
            })
            .catch(function(err){
                done(login.invalidCredentials);
            })
    });
});