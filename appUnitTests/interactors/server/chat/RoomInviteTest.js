describe('RoomInvite', function(){
    beforeEach(function(){
        var that = this;
        this.sameRoomUsers = [new User('sender', 'a', 0, 1), new User('username2', 'a', 0, 1), new User('username3', 'a', 0, 1)];
        this.otherRoomUsers = [new User('username', 'a', 0, 1), new User('username2', 'a', 0, 1), new User('username3', 'a', 0, 1)];
        this.roomName = 'Main';
        this.usersNicks = ['username', 'username2', 'username3'];

        this.getRoomWithUsersById = function(roomId){
            return Promise.resolve(new Room(roomId, that.roomName, true, that.sameRoomUsers));
        };

        this.getOtherRoomWithUsersById = function(roomId){
            return Promise.resolve(new Room(roomId, that.roomName, true, that.otherRoomUsers));
        };

        this.send = function(){
            return Promise.resolve();
        }

        spyOn(this, 'getRoomWithUsersById').and.callThrough();
        spyOn(this, 'getOtherRoomWithUsersById').and.callThrough();
        spyOn(this, 'send').and.callThrough();

        this.roomInvite = new RoomInvite(this.send, this.getRoomWithUsersById);
    });

    it('gets users in room', function(done){
    	var that = this;

    	this.roomInvite.do('sender', 'receiver', 0, 'appName')
                .then(function(){
                    expect(that.getRoomWithUsersById).toHaveBeenCalledWith(0);
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
    
    it('sends back error when user is not in room', function(done){
    	var that = this;

        this.roomInvite = new RoomInvite(this.send, this.getOtherRoomWithUsersById);

    	this.roomInvite.do('sender', 'receiver', 0, 'appName')
                .then(function(){
                    expect(that.send).toHaveBeenCalledWith('sender', 'error', 'you are in wrong room');
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });

    it('sends room invite to given user', function(done){
    	var that = this;

    	this.roomInvite.do('sender', 'receiver', 0, 'appName')
                .then(function(){
                    expect(that.send).toHaveBeenCalledWith('receiver', 'roomInvite', {sender: 'sender', roomName: 'Main', roomId: 0, app: 'appName'});
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
});