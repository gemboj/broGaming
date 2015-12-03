describe('Offer', function(){
    beforeEach(function(){
        var that = this;

        this.send = function(){
            return Promise.resolve()
        };

        spyOn(this, 'send').and.callThrough();

        this.offer = new Offer(this.send);
    })

    it('sends offer to user', function(done){
    	var that = this;

    	this.offer.do('sender', 'receiver', 'description', 0, 0)
                .then(function(){
                    expect(that.send).toHaveBeenCalledWith('receiver', 'offer', {sender: 'sender', sessionDescription: 'description', id: 0, hostId: 0});
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
})