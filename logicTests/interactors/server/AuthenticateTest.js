xdescribe('Authenticate', function(){
    beforeEach(function(){
        this.findUserByUsername = function(username){
            return new Promise.resolve({username: 'username', password: 'password'});
        };

        this.findUserByUsernameWithError = function(username){
            return new Promise.reject();
        };
        this.successCb = function(){};
        this.failCb = function(){};

        this.matchingCredentials = {username: 'username', password: 'password'};
        this.notmatchingCredentials = {username: 'username', password: 'passwordd'};

        spyOn(this, 'successCb');
        spyOn(this, 'failCb');

        this.authenticate = new Authenticate(this.findUserByUsername);
    });

    it('calls successCb when password matches users password', function(){
        this.authenticate.do(this.matchingCredentials, this.successCb, this.failCb);

        expect(this.successCb).toHaveBeenCalled();
        expect(this.failCb).not.toHaveBeenCalled();
    });

    it('calls failsCb when password doesnt match users password or there is no such user', function(){
        this.authenticate.do(this.notmatchingCredentials, this.successCb, this.failCb);

        expect(this.failCb).toHaveBeenCalledWith('Wrong username or password');
    });
});