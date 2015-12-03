describe('AutoJoinRoom', function(){
    beforeEach(function(){
        var that = this;

        this.roomData = {id: 0, name: 'roomName', users: []}
        this.joinRoom = function(){
            return Promise.resolve(that.roomData);
        };

        this.send = function(){

        };

        spyOn(this, 'joinRoom').and.callThrough();
        spyOn(this, 'send').and.callThrough();

        this.autoJoinRoom = new AutoJoinRoom(this.joinRoom, this.send);
    })

    it('joins user to choosen roomid', function(done){
    	var that = this;

    	this.autoJoinRoom.do('username')
                .then(function(){
                    expect(that.joinRoom).toHaveBeenCalledWith('username', 0);
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });

    it('sends user roomData', function(done){
    	var that = this;

    	this.autoJoinRoom.do('username')
                .then(function(){
                    expect(that.send).toHaveBeenCalledWith('username', 'joinedRoom', that.roomData);
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
})