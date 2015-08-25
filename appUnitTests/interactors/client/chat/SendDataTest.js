describe('SendData', function(){
    beforeEach(function(){

        this.send = function(){
            return Promise.resolve();
        };

        spyOn(this, 'send').and.callThrough();

        this.sendData = new SendData(this.send);
    })

    it('sends formatted data', function(done){
    	var that = this;

    	this.sendData.do('receiver', 'message', 'someMessage')
                .then(function(){
                    expect(that.send).toHaveBeenCalledWith('sendData', {receiver: 'receiver', data: {type: 'message', data: 'someMessage'}});
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
});