describe('Answer', function(){
    beforeEach(function(){
        var that = this;

        this.send = function(){
            return Promise.resolve()
        };

        spyOn(this, 'send').and.callThrough();

        this.answer = new Answer(this.send);
    })

    it('sends answer to user', function(done){
    	var that = this;

    	this.answer.do('receiver', 'description', 0, 0)
                .then(function(){
                    expect(that.send).toHaveBeenCalledWith('receiver', 'answer', {sessionDescription: 'description', id: 0, hostId: 0});
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
})