describe('Logout', function(){
    beforeEach(function () {
        this.markAsNotLogged = function(){
            return Promise.resolve()
        };

        this.removeFromRooms = function(){
            return Promise.resolve()
        };



        this.resolved = function(){};
        this.rejected = function(){};

        spyOn(this, 'resolved');
        spyOn(this, 'rejected');
        spyOn(this, 'markAsNotLogged').and.callThrough();
        spyOn(this, 'removeFromRooms').and.callThrough();
    });

    it('marks user as not logged and removes from all rooms', function (done) {
        var that = this;

        this.logout = new Logout(this.markAsNotLogged, this.removeFromRooms);

        this.logout.do('username')
            .then(that.resolved)
            .catch(that.rejected)
            .then(function () {
                expect(that.markAsNotLogged).toHaveBeenCalled();
                expect(that.removeFromRooms).toHaveBeenCalled();

                expect(that.resolved).toHaveBeenCalled();
                done();
            })
            .catch(function () {
                done.fail();
            });
    })
});