describe('LeaveRoom', function(){
    beforeEach(function(){
        var that = this;

        this.users = [new User('username', 'a', 0, 1), new User('username2', 'a', 0, 1), new User('username3', 'a', 0, 1)];
        this.roomName = 'Main';
        this.usersNicks = ['username', 'username2', 'username3'];

        this.getRoomWithUsersById = function(roomId){
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

        spyOn(this, 'getRoomWithUsersById').and.callThrough();
        spyOn(this, 'send').and.callThrough();
        spyOn(this, 'removeUsernameFromRoomid').and.callThrough();
        spyOn(this, 'removeRoomById').and.callThrough();

        this.leaveRoom = new LeaveRoom(this.getRoomWithUsersById, this.send, this.removeUsernameFromRoomid, this.removeRoomById);
    });

    it('gets room with users', function(done){
    	var that = this;

    	this.leaveRoom.do('username', 0)
                .then(function(){
                    expect(that.getRoomWithUsersById).toHaveBeenCalledWith(0);
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
                    expect(that.send).toHaveBeenCalledWith('username2', 'someoneLeavedRoom', {roomId: 0, username: 'username'});
                    expect(that.send).toHaveBeenCalledWith('username3', 'someoneLeavedRoom', {roomId: 0, username: 'username'});
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

    it('tries to remove room', function(done){
    	var that = this;

    	this.leaveRoom.do('username', 0)
                .then(function(){
                    expect(that.removeRoomById).toHaveBeenCalledWith(0);
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
})