describe('CreateRoom', function(){
    beforeEach(function(){
        this.room = {id: 0, name: 'roomName', users: []};
        var that = this;
        this.send = function(){
            return Promise.resolve(that.room);
        };

        this.addRoom = function(){
            return that.room;
        };

        spyOn(this, 'send').and.callThrough();
        spyOn(this, 'addRoom').and.callThrough();

        this.createRoom = new CreateRoom(this.send, this.addRoom)
    });

    it('sends createRoom message', function(){
        this.createRoom.do('roomName');

        expect(this.send).toHaveBeenCalledWith('createRoom', {roomName: 'roomName'});
    });

    it('calls callback with room data', function(done){
        var that = this;

        this.createRoom.do()
            .then(function(){
                expect(that.addRoom).toHaveBeenCalledWith(that.room);

                done();
            })
            .catch(function(err){
                done.fail(err);
            });
    })

    xit('wont call callback when it is undefined', function(done){
    	var that = this;

        this.createRoom = new CreateRoom(this.send);

    	this.createRoom.do()
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
                .then(function(room){
                    expect(room.name).toBe('roomName');
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
});