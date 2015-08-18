describe('AuthenticateUser', function(){
    beforeEach(function(){
        this.findUsersByUsername = function(){
            return Promise.resolve([new User('username', 'password')]);
        };

        this.findUsersByUsernameWithError = function(username){
            return Promise.reject('error');
        };

        this.credentials = {username: 'username', password: 'password'};

        this.resolved = function(){};
        this.rejected = function(){};

        spyOn(this, 'resolved').and.callThrough();
        spyOn(this, 'rejected').and.callThrough();
    });

    it('resolves promise when given password matches that in database', function(done){
        this.authenticate = new AuthenticateUser(this.findUsersByUsername);

        var that = this;
        this.authenticate.do(this.credentials)
            .then(this.resolved)
            .catch(this.rejected)
            .then(function(){
                expect(that.resolved).toHaveBeenCalled();
                expect(that.rejected).not.toHaveBeenCalled();
                done();
            })
            .catch(function () {
                done.fail();
            });
    });

    it('reject promise when passwords dont match', function(){
        this.authenticate = new AuthenticateUser(this.findUsersByUsernameWithError);

        var that = this;
        this.authenticate.do(this.credentials)
            .then(this.resolved)
            .catch(this.rejected)
            .then(function(){
                expect(that.resolved).toHaveBeenCalled();
                expect(that.rejected).not.toHaveBeenCalled();
                done();
            })
            .catch(function () {
                done.fail();
            });
    });
});