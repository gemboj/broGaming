describe('VefiryConnection', function () {
    beforeEach(function () {
        this.loginDo = function () {
            return Promise.resolve();
        };
        this.authenticateUserDo = function () {
            return Promise.resolve();
        };

        this.authenticateUserDoError = function () {
            return Promise.reject('error');
        };

        this.resolved = function(){};
        this.rejected = function(){};

        spyOn(this, 'resolved');
        spyOn(this, 'rejected');


    })

    it('calls both authenticate and login', function (done) {
        var that = this;

        this.verifyConnection = new VerifyConnection(this.authenticateUserDo, this.loginDo);

        this.verifyConnection.do({username: 'username'})
            .then(that.resolved)
            .catch(that.rejected)
            .then(function () {
                expect(that.resolved).toHaveBeenCalled();
                done()
            });
    });
});