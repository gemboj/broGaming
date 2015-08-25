describe('SendRoomData', function(){
    beforeEach(function(){

        this.send = function(){
            return Promise.resolve();
        };

        spyOn(this, 'send').and.callThrough();

        this.sendRoomData = new SendRoomData(this.send);
    })

    it('sends formatted data', function(done){
    	var that = this;

    	this.sendRoomData.do(0, 'roomMessage', 'someMessage')
                .then(function(){
                    expect(that.send).toHaveBeenCalledWith('sendRoomData', {roomId: 0, data: {type: 'roomMessage', data: 'someMessage'}});
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
});