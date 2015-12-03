describe('SendRoomInvite', function(){
    beforeEach(function(){
        var that = this;

        this.send = function(){
            return Promise.resolve();
        }

        spyOn(this, 'send').and.callThrough();

        this.sendRoomInvite = new SendRoomInvite(this.send);
    })

    it('sends room invite', function(done){
    	var that = this;

    	this.sendRoomInvite.do(0, 'receiver', 'appName')
                .then(function(){
                    expect(that.send).toHaveBeenCalledWith('roomInvite', {roomId: 0, receiver: 'receiver', app: 'appName'});
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
});