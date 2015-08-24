describe('LeaveRoom', function(){
    beforeEach(function(){
        this.send = function(){
            return Promise.resolve();
        };

        this.removeRoom = function(){

        };

        spyOn(this, 'send').and.callThrough();
        spyOn(this, 'removeRoom').and.callThrough();

        this.leaveRoom = new LeaveRoom(this.send, this.removeRoom);
    })

    it('sends leave room message', function(done){
    	var that = this;

    	this.leaveRoom.do(0)
                .then(function(){
                    expect(that.send).toHaveBeenCalledWith('leaveRoom', {roomId: 0});
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });

    it('removes room from display', function(done){
    	var that = this;

    	this.leaveRoom.do(0)
                .then(function(){
                    expect(that.removeRoom).toHaveBeenCalled();
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
});