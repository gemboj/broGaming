describe('Register', function(){
    beforeEach(function(){
        var that = this;

        this.ajax = function(){
            return Promise.resolve('some message');
        };

        this.showRegisterMessage = function(){

        };

        spyOn(this, 'ajax').and.callThrough();
        spyOn(this, 'showRegisterMessage').and.callThrough();

        this.register = new Register(this.ajax, 'someUrl', this.showRegisterMessage);
    })

    it('sends ajax request with username and password', function(done){
    	var that = this;

    	this.register.do('username', 'password', 'email')
        	.then(function(){
        	    expect(that.ajax).toHaveBeenCalledWith('someUrl', {username: 'username', password: 'password', email: 'email'});
        	    done();
        	})
        	.catch(function(err){
        	    done.fail(err);
        	})
    });

    it('shows received message', function(done){
    	var that = this;

    	this.register.do('username', 'password', 'email')
        	.then(function(){
        	    expect(that.showRegisterMessage).toHaveBeenCalledWith('some message');
        	    done();
        	})
        	.catch(function(err){
        	    done.fail(err);
        	})
    });
})