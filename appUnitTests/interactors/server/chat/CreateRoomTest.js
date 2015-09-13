describe('CreateRoom', function(){
    beforeEach(function(){
        var that = this;

        this.transaction = function(func){
            return func('t');
        };

        this.insertRoom = function(room){
            if((room.id == 0) && (room.name == 'roomName') && (room.deletable === true) && (room.host === 'username')){
                return Promise.resolve();
            }

            return Promise.reject('rooms dont match')
        };

        this.roomData = {
            id : 0,
            name : 'roomName',
            host: 'username'
        };

        this.getNextRoomId = function(){
            return Promise.resolve(0);
        };

        this.usernameJoinsRoomid = function(){
            return Promise.resolve(that.roomData);
        };

        spyOn(this, 'insertRoom').and.callThrough();
        spyOn(this, 'getNextRoomId').and.callThrough();
        spyOn(this, 'usernameJoinsRoomid').and.callThrough();

        this.createRoom = new CreateRoom(this.insertRoom, this.getNextRoomId, this.usernameJoinsRoomid, this.transaction);
    });

    it('gets next room id', function(done){
        var that = this;

        this.createRoom.do('roomName', 'username')
            .then(function(){
                expect(that.getNextRoomId).toHaveBeenCalled();
                done();
            })
            .catch(function(err){
                done.fail(err);
            })
    });

    it('inserts room into db', function(done){
        var that = this;

        this.createRoom.do('roomName', 'username')
            .then(function(){
                expect(that.insertRoom).toHaveBeenCalled();
                done();
            })
            .catch(function(err){
                done.fail(err);
            })
    })

    it('joins user into created room', function(done){
        var that = this;

        this.createRoom.do('roomName', 'username')
            .then(function(){
                expect(that.usernameJoinsRoomid).toHaveBeenCalledWith('username', 0, 't');
                done();
            })
            .catch(function(err){
                done.fail(err);
            })
    });

    it('resolves with roomData', function(done){
        var that = this;

        this.createRoom.do('roomName', 'username')
            .then(function(roomData){
                expect(roomData).toBe(that.roomData);
                done();
            })
            .catch(function(err){
                done.fail(err);
            })
    });
});