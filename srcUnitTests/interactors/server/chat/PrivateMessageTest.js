describe('PrivateMessaqge', function(){
    beforeEach(function(){
        var that = this;

        this.send = function(){
            return Promise.resolve();
        };

        this.getExistingLoggedUserByUsername = function(){
            return Promise.resolve(new User('receiver', '', true, true));
        };

        this.getExistingNotLoggedUserByUsername = function(){
            return Promise.resolve(new User('receiver', '', false, false));
        };

        this.getNotExistingUserByUsername = function(){
            return Promise.resolve(null);
        };

        spyOn(this, 'send').and.callThrough();
        spyOn(this, 'getExistingLoggedUserByUsername').and.callThrough();
        spyOn(this, 'getNotExistingUserByUsername').and.callThrough();

        this.privateMessage = new PrivateMessage(this.send, this.getExistingLoggedUserByUsername);
    })

    it('sends private message to given user', function(done){
        var that = this;

        this.privateMessage.do('sender', 'receiver', 'message')
            .then(function(){
                expect(that.send).toHaveBeenCalledWith('receiver', 'privateMessage', {sender: 'sender', message: 'message'});
                done();
            })
            .catch(function(err){
                done.fail(err);
            })
    });

    it('sens back error when user is not logged', function(done){
    	var that = this;

        this.privateMessage = new PrivateMessage(this.send, this.getExistingNotLoggedUserByUsername);

    	this.privateMessage.do('sender', 'receiver', 'message')
                .then(function(){
                    expect(that.send).toHaveBeenCalledWith('sender', 'error', 'user receiver is not logged');
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });

    it('sends back erro when user does not exist', function(done){
    	var that = this;

        this.privateMessage = new PrivateMessage(this.send, this.getNotExistingUserByUsername);

    	this.privateMessage.do('sender', 'receiver', 'message')
                .then(function(){
                    expect(that.send).toHaveBeenCalledWith('sender', 'error', 'user receiver does not exist');
                    done();
                })
                .catch(function(err){
                    done.fail(err);
                })
    });
})