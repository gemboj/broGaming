describe('SendData', function(){
    beforeEach(function(){

        this.geLoggedUserByUsername = function(username){
            return Promise.resolve(new User('receiver', 'a', true, true));
        };

        this.geNotLoggedUserByUsername = function(username){
            return Promise.resolve(new User('receiver', 'a', false, true));
        };

        this.getNotExistingUserByUsername = function(username){
            return Promise.resolve(null);
        };

        this.send = function(){

        };

        spyOn(this, 'geLoggedUserByUsername').and.callThrough();
        spyOn(this, 'geNotLoggedUserByUsername').and.callThrough();
        spyOn(this, 'getNotExistingUserByUsername').and.callThrough();
        spyOn(this, 'send').and.callThrough();

        this.sendData = new SendData(this.geLoggedUserByUsername, this.send);
    })

    it('gets receiver from db', function(done){
    	var that = this;

    	this.sendData.do('receiver', 'sender', {type: 'message', data: 'some message'})
                .then(function(){
                    expect(that.geLoggedUserByUsername).toHaveBeenCalledWith('receiver');
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });

    it('sends back error when user is not logged in', function(done){
    	var that = this;

        var receiver = 'receiver';
        this.sendData = new SendData(this.geNotLoggedUserByUsername, this.send);

    	this.sendData.do(receiver, 'sender', {type: 'message', data: 'some message'})
                .then(function(){
                    expect(that.send).toHaveBeenCalledWith('sender', 'error', 'user: ' + receiver + ' is not logged in');
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });

    it('send back error when user does not exists', function(done){
    	var that = this;

        var receiver = 'receiver';
        this.sendData = new SendData(this.getNotExistingUserByUsername, this.send);

    	this.sendData.do(receiver, 'sender', {type: 'message', data: 'some message'})
                .then(function(){
                    expect(that.send).toHaveBeenCalledWith('sender', 'error', 'user: ' + receiver + ' does not exists');
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });

    it('sends data to receiver', function(done){
    	var that = this;

    	this.sendData.do('receiver', 'sender', {type: 'message', data: 'someMessage'})
                .then(function(){
                    expect(that.send).toHaveBeenCalledWith('receiver', 'message', 'someMessage');
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
});