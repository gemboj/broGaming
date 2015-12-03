describe('IceCandidate', function(){
    beforeEach(function(){
        var that = this;

        this.send = function(){
            return Promise.resolve()
        };

        spyOn(this, 'send').and.callThrough();

        this.iceCandidate = new IceCandidate(this.send);
    })

    it('sends answer to user', function(done){
    	var that = this;

    	this.iceCandidate.do('receiver', 'iceCandidate', 0, 0)
                .then(function(){
                    expect(that.send).toHaveBeenCalledWith('receiver', 'iceCandidate', {iceCandidate: 'iceCandidate', id: 0, hostId: 0});
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
})