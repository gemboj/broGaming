describe('Logout', function(){
    beforeEach(function () {
        this.removeUser = function(){return Promise.resolve()};

        this.logout = new Logout(this.removeUser);

        this.resolved = function(){};
        this.rejected = function(){};

        spyOn(this, 'resolved');
        spyOn(this, 'rejected');
    });

    it('removes user form db', function (done) {
        var that = this;

        this.logout.do('username')
            .then(that.resolved)
            .catch(that.rejected)
            .then(function () {
                expect(that.resolved).toHaveBeenCalled();
                expect(that.rejected).not.toHaveBeenCalled();

                done();
            })
            .catch(function () {
                done.fail();
            });
    })
});