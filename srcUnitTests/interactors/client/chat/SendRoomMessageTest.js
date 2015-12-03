describe('SendRoomMessage', function(){
    beforeEach(function(){
        var that = this;

        this.send = function(){
            return Promise.resolve();
        }

        spyOn(this, 'send').and.callThrough();

        this.sendRoomMessage = new SendRoomMessage(this.send);
    })

    it('sends room message', function(done){
    	var that = this;

    	this.sendRoomMessage.do(0, 'message')
                .then(function(){
                    expect(that.send).toHaveBeenCalledWith('roomMessage', {roomId: 0, message: 'message'});
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
});