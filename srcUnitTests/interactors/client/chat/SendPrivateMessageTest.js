describe('SendPrivateMessage', function(){
    beforeEach(function(){
        var that = this;

        this.send = function(){
            return Promise.resolve();
        }

        spyOn(this, 'send').and.callThrough();

        this.sendPrivateMessage = new SendPrivateMessage(this.send);
    })

    it('sends private message', function(done){
    	var that = this;

    	this.sendPrivateMessage.do('receiver', 'message')
                .then(function(){
                    expect(that.send).toHaveBeenCalledWith('privateMessage', {receiver: 'receiver', message: 'message'});
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
});