describe('DeleteTemporaryData', function(){
    beforeEach(function(){

        this.deleteRooms = function(){
            return Promise.resolve();
        };

        this.logoutUsers = function(){
            return Promise.resolve(0);
        };

        spyOn(this, 'deleteRooms').and.callThrough();
        spyOn(this, 'logoutUsers').and.callThrough();

        this.deleteTemporaryData = new DeleteTemporaryData(this.deleteRooms, this.logoutUsers);
    });

    it('deletes all rooms', function(done){
        var that = this;

        this.deleteTemporaryData.do()
            .then(function(){
                expect(that.deleteRooms).toHaveBeenCalled();
                done();
            })
            .catch(function(err){
                done.fail(err);
            })


    });

    it('logouts users', function(done){
        var that = this;

        this.deleteTemporaryData.do()
            .then(function(){
                expect(that.logoutUsers).toHaveBeenCalled();
                done();
            })
            .catch(function(err){
                done.fail(err);
            })


    });
});