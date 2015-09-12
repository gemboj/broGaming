describe('UserLoginFormTest', function(){
    beforeEach(function(){
        var that = this;

        this.userLoginForm = new UserLoginForm();
    });

    it('returns ValidateError object', function(){
    	var that = this;

    	expect(this.userLoginForm.do('username', 'password') instanceof ValidateError).toBe(true);
    });

    it('requires username length to be >= 3', function(){
    	var that = this;

        var result = this.userLoginForm.do('us', 'password');
        expect(result.username.tooShort).toBe('username is too short (min. 3 characters)');
    });

    it('requires password length to be >= 8', function(){
    	var that = this;

    	var result = this.userLoginForm.do('username', 'pass');
        expect(result.password.tooShort).toBe('password is too short (min. 8 characters)');
    });

    it('returns multiple errors if needed', function(){
    	var that = this;

    	var result = this.userLoginForm.do('us', 'pass');
        expect(result.username.tooShort).toBe('username is too short (min. 3 characters)');
        expect(result.password.tooShort).toBe('password is too short (min. 8 characters)');
    });
})