describe('Login', function(){
    beforeEach(function () {
        
        this.isAuthenticCredentialsResolve = function(user){
            return Promise.resolve();
        };

        this.isAuthenticCredentialsReject = function(user){
            return Promise.reject('invalidCredentials');
        };
        
        this.markUserAsLoggedResolve = function(){
            return Promise.resolve();
        };

        this.markUserAsLoggedReject = function(){
            return Promise.reject('alreadyLogged');
        };

        this.resolved = function(){};
        this.rejected = function(){};

        spyOn(this, 'resolved');
        spyOn(this, 'rejected');
        spyOn(this, 'isAuthenticCredentialsResolve').and.callThrough();
        spyOn(this, 'isAuthenticCredentialsReject').and.callThrough();
        spyOn(this, 'markUserAsLoggedResolve').and.callThrough();
        spyOn(this, 'markUserAsLoggedReject').and.callThrough();
    });

    it('it resolves when given credentials matches that in db, user is not already logged and marks user as logged', function(done){
        var that = this,
            login = new Login(this.isAuthenticCredentialsResolve, this.markUserAsLoggedResolve);


        login.do({username: 'username', password: 'password'})
            .then(function () {
                that.resolved();
            })
            .catch(function () {
                that.rejected();
            })
            .then(function () {
                expect(that.isAuthenticCredentialsResolve).toHaveBeenCalled();
                expect(that.markUserAsLoggedResolve).toHaveBeenCalled();

                expect(that.resolved).toHaveBeenCalled();
                done();

            })
            .catch(function () {
                done.fail();
            });
    }, 2000);

    it('it rejects with message when user does not exists', function(done){
        var that = this,
            login = new Login(this.isAuthenticCredentialsReject, this.markUserAsLoggedResolve);


        login.do({username: 'username', password: 'password'})
            .then(function () {
                that.resolved();
            })
            .catch(function (err) {
                that.rejected(err);
            })
            .then(function () {
                expect(that.isAuthenticCredentialsReject).toHaveBeenCalled();
                expect(that.markUserAsLoggedResolve).not.toHaveBeenCalled();

                expect(that.rejected).toHaveBeenCalledWith(login.invalidCredentials);
                done();

            })
            .catch(function () {
                done.fail();
            });
    })

    it('it rejects with message when user is already logged in', function(done){
        var that = this,
            login = new Login(this.isAuthenticCredentialsResolve, this.markUserAsLoggedReject);


        login.do({username: 'username', password: 'password'})
            .then(function () {
                that.resolved();
            })
            .catch(function (err) {
                that.rejected(err);
            })
            .then(function () {
                expect(that.isAuthenticCredentialsResolve).toHaveBeenCalled();
                expect(that.markUserAsLoggedReject).toHaveBeenCalled();

                expect(that.rejected).toHaveBeenCalledWith(login.alreadyLogged);
                done();

            })
            .catch(function () {
                done.fail();
            });
    })
});