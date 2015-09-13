describe('CreateRoom', function(){
    beforeEach(function(){
        this.room = {id: 0, name: 'roomName', usernames: []};
        var that = this;
        this.send = function(){
            return Promise.resolve(that.room);
        };

        this.addRoom = function(){
            return that.room;
        };

        this.showError = function(){

        }

        spyOn(this, 'send').and.callThrough();
        spyOn(this, 'addRoom').and.callThrough();

        this.createRoom = new CreateRoom(this.send, this.addRoom, this.showError)
    });

    it('sends createRoom message', function(){
        this.createRoom.do('roomName');

        expect(this.send).toHaveBeenCalledWith('createRoom', {roomName: 'roomName'});
    });

    it('calls callback with room data', function(done){
        var that = this;

        this.createRoom.do('roomName')
            .then(function(){
                expect(that.addRoom).toHaveBeenCalledWith(that.room.id, that.room.name, [], undefined);

                done();
            })
            .catch(function(err){
                done.fail(err);
            });
    })

    xit('wont call callback when it is undefined', function(done){
    	var that = this;

        this.createRoom = new CreateRoom(this.send, this.addRoom, this.showError);

    	this.createRoom.do('roomName')
                .then(function(){
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });

    it('resolves with room data', function(done){
    	var that = this;

    	this.createRoom.do('roomName')
                .then(function(roomData){
                    expect(roomData).toBe(that.room);
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
});