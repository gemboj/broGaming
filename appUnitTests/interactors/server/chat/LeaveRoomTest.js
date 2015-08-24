describe('LeaveRoom', function(){
    beforeEach(function(){
        var that = this;

        this.users = [new User('username', 'a', 0, 1), new User('username2', 'a', 0, 1), new User('username3', 'a', 0, 1)];
        this.roomName = 'Main';
        this.usersNicks = ['username', 'username2', 'username3'];

        this.getDeletableRoomWithUsersById = function(roomId){
            return Promise.resolve(new Room(roomId, that.roomName, 1, that.users));
        };

        this.getNonDeletableRoomWithUsersById = function(roomId){
            return Promise.resolve(new Room(roomId, that.roomName, 0, that.users));
        };

        this.send = function(){

        };

        this.removeUsernameFromRoomid = function(username, roomId){
            return Promise.resolve();
        }

        this.removeRoomById = function(roomId){
            return Promise.resolve();
        }

        spyOn(this, 'getDeletableRoomWithUsersById').and.callThrough();
        spyOn(this, 'send').and.callThrough();
        spyOn(this, 'removeUsernameFromRoomid').and.callThrough();
        spyOn(this, 'removeRoomById').and.callThrough();

        this.leaveRoom = new LeaveRoom(this.getDeletableRoomWithUsersById, this.send, this.removeUsernameFromRoomid, this.removeRoomById);
    });

    it('gets room with users', function(done){
    	var that = this;

    	this.leaveRoom.do('username', 0)
                .then(function(){
                    expect(that.getDeletableRoomWithUsersById).toHaveBeenCalledWith(0);
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });

    it('broadcasts leave message to all OTHER users', function(done){
    	var that = this;

    	this.leaveRoom.do('username', 0)
                .then(function(){
                    expect(that.send.calls.count()).toBe(2);
                    expect(that.send).toHaveBeenCalledWith('username2', 'someoneLeftRoom', {roomId: 0, username: 'username'});
                    expect(that.send).toHaveBeenCalledWith('username3', 'someoneLeftRoom', {roomId: 0, username: 'username'});
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });

    it('removes user from room', function(done){
    	var that = this;

    	this.leaveRoom.do('username', 0)
                .then(function(){
                    expect(that.removeUsernameFromRoomid).toHaveBeenCalledWith('username', 0);
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });

    it('tries to remove only deletable rooms', function(done){
    	var that = this;

        var leaveRoomDeletable = new LeaveRoom(this.getDeletableRoomWithUsersById, this.send, this.removeUsernameFromRoomid, this.removeRoomById);

    	leaveRoomDeletable.do('username', 0)
                .then(function(){
                    expect(that.removeRoomById).toHaveBeenCalledWith(0);
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });

    it('wont delete non deletable rooms', function(done){
    	var that = this;

        var leaveRoomNonDeletable = new LeaveRoom(this.getNonDeletableRoomWithUsersById, this.send, this.removeUsernameFromRoomid, this.removeRoomById);

    	leaveRoomNonDeletable.do('username', 0)
                .then(function(){
                    expect(that.removeRoomById).not.toHaveBeenCalled();
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });

    it('resolves with room id', function(done){
    	var that = this;

    	this.leaveRoom.do('username', 0)
                .then(function(roomId){
                    expect(roomId).toBe(0);
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
    
    xit('wont resolve when room is not deletable', function(done){
    	var that = this;
    
    	this.leaveRoom.do('username', 0)
                .then(function(){
                    //expect().to();
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
});