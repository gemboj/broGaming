describe('UserRegistrationFormTest', function(){
    beforeEach(function(){
        var that = this;

        this.userLoginForm = new UserLoginForm();
        this.userRegistrationForm = new UserRegistrationForm(this.userLoginForm.do);
    });

    it('returns ValidateError object', function(){
        var that = this;

        expect(this.userRegistrationForm.do('username', 'password', 'aaa@bbb.ccc') instanceof ValidateError).toBe(true);
    });

    it('requires emails to be in valid format aaa@bbb.ccc', function(){
        var result = this.userRegistrationForm.do('username', 'password', 'wrongEmail');
        expect(result.email.invalid).toBe('invalid email');

        result = this.userRegistrationForm.do('username', 'password', 'aaa@bbb.ccc');
        expect(result.email.invalid).toBe(undefined);
    })
})