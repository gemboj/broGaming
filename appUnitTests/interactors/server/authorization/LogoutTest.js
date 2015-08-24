describe('Logout', function(){
    beforeEach(function () {
        this.markAsNotLogged = function(){
            return Promise.resolve()
        };



        this.removeFromRoom = function(){
            return Promise.resolve();
        };

        this.getUsernameRooms = function(username){
            return Promise.resolve([new Room(1, 'roomName1', 0), new Room(2, 'roomName2', 0), new Room(3, 'roomName3', 0)]);
        };

        this.leaveRoom = function(username, roomId){
            return Promise.resolve();
        };

        spyOn(this, 'markAsNotLogged').and.callThrough();
        spyOn(this, 'getUsernameRooms').and.callThrough();
        spyOn(this, 'leaveRoom').and.callThrough();

        this.logout = new Logout(this.markAsNotLogged, this.getUsernameRooms, this.leaveRoom);
    });

    it('marks user as not logged', function (done) {
        var that = this;



        this.logout.do('username')
            .then(function () {
                expect(that.markAsNotLogged).toHaveBeenCalled();

                done();
            })
            .catch(function () {
                done.fail();
            });
    })

    it('gets list of rooms in which user is', function(done){
    	var that = this;

    	this.logout.do('username')
                .then(function(){
                    expect(that.getUsernameRooms).toHaveBeenCalledWith('username');
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });

    it('leaves user from all rooms', function(done){
    	var that = this;

    	this.logout.do('username')
                .then(function(){
                    //expect(that.leaveRoom.calls.count()).toBe(3);
                    expect(that.leaveRoom).toHaveBeenCalledWith('username', 1);
                    expect(that.leaveRoom).toHaveBeenCalledWith('username', 2);
                    expect(that.leaveRoom).toHaveBeenCalledWith('username', 3);
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
});