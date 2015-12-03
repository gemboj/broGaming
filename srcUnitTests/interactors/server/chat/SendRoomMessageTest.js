describe('SendRoomMessage', function(){
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

        this.sendRoomMessage = new SendRoomMessage(this.getRoomWithUsersById, this.send);
    });

    it('gets users room', function(done){
    	var that = this;

    	this.sendRoomMessage.do(0, 'sender', 'message')
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

        this.sendRoomMessage = new SendRoomMessage(this.getOtherRoomWithUsersById, this.send);

    	this.sendRoomMessage.do(0, 'sender', 'message')
                .then(function(){
                    expect(that.send).toHaveBeenCalledWith('sender',  'error', 'you can not send messages to that room');
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });

    it('sends message to room users', function(done){
    	var that = this;

    	this.sendRoomMessage.do(0, 'sender', 'message')
                .then(function(){
                    expect(that.send).toHaveBeenCalledWith('sender', 'roomMessage', {message: 'message', roomName: 'Main', sender: 'sender'});
                    expect(that.send).toHaveBeenCalledWith('username2', 'roomMessage', {message: 'message', roomName: 'Main', sender: 'sender'});
                    expect(that.send).toHaveBeenCalledWith('username3', 'roomMessage', {message: 'message', roomName: 'Main', sender: 'sender'});
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
})