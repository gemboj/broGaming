describe('ActivateAccount', function(){
    beforeEach(function(){
        var that = this;

        this.getUserByActivationLink = function(){
            return Promise.resolve(new User('username', 'password', false, false));
        };

        this.getUserByActivationLinkWrongLink = function(){
            return Promise.resolve(null);
        };

        this.markAsActiveUserByUsername = function(){
            return Promise.resolve();
        }


    })

    it('resolves if activation was successfull', function(done){
    	var that = this;
        this.activateAccount = new ActivateAccount(this.getUserByActivationLink, this.markAsActiveUserByUsername);
    	this.activateAccount.do('username', '1234567890')
        	.then(function(){
        	    done();
        	})
        	.catch(function(err){
        	    done.fail(err);
        	})
    });

    it('reject if activation was not successfull', function(done){
        var that = this;
        this.activateAccount = new ActivateAccount(this.getUserByActivationLinkWrongLink, this.markAsActiveUserByUsername);
        this.activateAccount.do('username', '1234567890123456')
            .then(function(){
                done.fail();
            })
            .catch(function(){
                done();
            })
    });
})