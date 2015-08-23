describe('CreateRoom', function(){
    beforeEach(function(){
        this.insertRoom = function(room){
            if((room.id == 0) && (room.name == 'roomName') && (room.deletable === true)){
                return Promise.resolve();
            }

            return Promise.reject('rooms dont match')
        };

        this.getNextRoomId = function(){
            return Promise.resolve(0);
        };

        this.usernameJoinsRoomid = function(){
            return Promise.resolve();
        };

        spyOn(this, 'insertRoom').and.callThrough();
        spyOn(this, 'getNextRoomId').and.callThrough();
        spyOn(this, 'usernameJoinsRoomid').and.callThrough();

        this.createRooms = new CreateRoom(this.insertRoom, this.getNextRoomId, this.usernameJoinsRoomid);
    });

    it('gets next room id', function(done){
        var that = this;

        this.createRooms.do('roomName')
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

        this.createRooms.do('roomName')
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

    	this.createRooms.do('roomName', 'username')
                .then(function(){
                    expect(that.usernameJoinsRoomid).toHaveBeenCalledWith('username', 0);
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
});