describe('ReceiveRoomInvite', function(){
    beforeEach(function(){
        var that = this;

        this.showRoomInviteResolve = function(roomName){
            return Promise.resolve();
        };

        this.data = {id: 0, name: 'name', usernames: ['username1', 'username2']};
        this.send = function(){
            return Promise.resolve(that.data);
        };

        this.addRoom = function(data){

        };

        spyOn(this, 'showRoomInviteResolve').and.callThrough();
        spyOn(this, 'send').and.callThrough();
        spyOn(this, 'addRoom').and.callThrough();

        this.receiveRoomInvite = new ReceiveRoomInvite(this.showRoomInviteResolve, this.send, this.addRoom);
    })
    
    it('shows room invite', function(done){
    	var that = this;
    
    	this.receiveRoomInvite.do({roomId: 0, roomName: 'roomName'})
                .then(function(){
                    expect(that.showRoomInviteResolve).toHaveBeenCalledWith('roomName');
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });

    it('sends joinRoom when showRoomInvite resolves ', function(done){
    	var that = this;

    	this.receiveRoomInvite.do({roomId: 0, roomName: 'roomName'})
                .then(function(){
                    expect(that.send).toHaveBeenCalledWith('joinRoom', {roomId: 0});
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });

    it('adds room when succesfully joined room', function(done){
    	var that = this;
    
    	this.receiveRoomInvite.do({roomId: 0, roomName: 'roomName'})
                .then(function(){
                    expect(that.addRoom).toHaveBeenCalledWith(that.data);
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
});