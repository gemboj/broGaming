describe('ReceiveRoomInvite', function(){
    beforeEach(function(){
        var that = this;

        this.addRoomInviteResolve = function(roomName){
            return Promise.resolve();
        };

        this.data = {id: 0, name: 'name', usernames: ['username1', 'username2']};
        this.send = function(){
            return Promise.resolve(that.data);
        };

        this.room = {};
        this.addRoom = function(data){
            return that.room;
        };

        this.createApp = function(data){

        };

        spyOn(this, 'addRoomInviteResolve').and.callThrough();
        spyOn(this, 'send').and.callThrough();
        spyOn(this, 'addRoom').and.callThrough();
        spyOn(this, 'createApp').and.callThrough();

        this.receiveRoomInvite = new ReceiveRoomInvite(this.addRoomInviteResolve, this.send, this.addRoom, this.createApp);
    })
    
    it('shows room invite', function(done){
    	var that = this;
    
    	this.receiveRoomInvite.do('sender', 'roomName', 0)
                .then(function(){
                    expect(that.addRoomInviteResolve).toHaveBeenCalledWith("sender invites you to room: roomName");
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });

    it('sends joinRoom when addInvite resolves ', function(done){
    	var that = this;

    	this.receiveRoomInvite.do('sender', 'roomName', 0)
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
    
    	this.receiveRoomInvite.do('sender', 'roomName', 0)
                .then(function(){
                    expect(that.addRoom).toHaveBeenCalledWith(that.data.id, that.data.name, that.data.usernames, that.data.host);
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });

    it('creates src when join room data contains src name', function(done){
    	var that = this;

    	this.receiveRoomInvite.do('sender', 'roomName', 0, 'appName')
                .then(function(){
                    expect(that.createApp).toHaveBeenCalledWith('appName', that.room);
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
});