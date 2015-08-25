describe('SendRoomData', function(){
    beforeEach(function(){
        var that = this;
        this.sameRoomUsers = [new User('sender', 'a', 0, 1), new User('username2', 'a', 0, 1), new User('username3', 'a', 0, 1)];
        this.otherRoomUsers = [new User('username', 'a', 0, 1), new User('username2', 'a', 0, 1), new User('username3', 'a', 0, 1)];
        this.roomName = 'Main';
        this.usersNicks = ['username', 'username2', 'username3'];

        this.getRoomWithUsersById = function(roomId){
            return Promise.resolve(new Room(roomId, that.roomName, 0, that.sameRoomUsers));
        };

        this.getOtherRoomWithUsersById = function(roomId){
            return Promise.resolve(new Room(roomId, that.roomName, 0, that.otherRoomUsers));
        };

        this.send = function(){

        };

        spyOn(this, 'getRoomWithUsersById').and.callThrough();
        spyOn(this, 'getOtherRoomWithUsersById').and.callThrough();
        spyOn(this, 'send').and.callThrough();

        this.sendRoomData = new SendRoomData(this.getRoomWithUsersById, this.send);
    });

    it('gets users room', function(done){
    	var that = this;

    	this.sendRoomData.do(0)
                .then(function(){
                    expect(that.getRoomWithUsersById).toHaveBeenCalledWith(0);
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });

    it('sends error when user does not belong to room', function(done){
    	var that = this;

        this.sendRoomData = new SendRoomData(this.getOtherRoomWithUsersById, this.send);

    	this.sendRoomData.do(0, 'sender')
                .then(function(){
                    expect(that.send).toHaveBeenCalledWith('sender',  'error', 'you can not send messages to that room');
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });

    it('sends data to room users with given type', function(done){
    	var that = this;

    	this.sendRoomData.do(0, 'sender', {type: 'roomMessage', data: 'some message'})
                .then(function(){
                    expect(that.send).toHaveBeenCalledWith('sender', 'roomMessage', 'some message');
                    expect(that.send).toHaveBeenCalledWith('username2', 'roomMessage', 'some message');
                    expect(that.send).toHaveBeenCalledWith('username3', 'roomMessage', 'some message');
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
})