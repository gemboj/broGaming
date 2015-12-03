describe('ValidateError', function(){
    beforeEach(function(){
        var that = this;
    });

    it('creates objects properties', function(){
        var validateError = new ValidateError(['username', 'password']);
    	expect(validateError.username instanceof Object).toBe(true);
    	expect(validateError.password instanceof Object).toBe(true);
    });

    it('can return first error it finds', function(){
        var validateError = new ValidateError(['username', 'password']);
        validateError.username.tooShort = 'too short username';
        validateError.password.tooShort = 'too short password';

        var error = validateError.getError();

        expect(error === 'too short password' || error === 'too short username').toBe(true)
    });

    it('can return first error of given field', function(){
        var validateError = new ValidateError(['username', 'password']);
        validateError.username.tooShort = 'too short username';

        expect(validateError.getError('username')).toBe('too short username');
        expect(validateError.getError('password')).toBe('');
    })

    it('returns empty string when no errors found', function(){
        var validateError = new ValidateError(['username', 'password']);

        expect(validateError.getError()).toBe('');

    })

    it('can add additional properties', function(){
        var validateError = new ValidateError(['username', 'password']);
        expect(validateError.email).toBe(undefined);

        validateError.addProperty('email');
        expect(validateError.email instanceof Object).toBe(true);
    })

    it('can add multiply properties from array', function(){
        var validateError = new ValidateError(['username', 'password']);
        expect(validateError.email).toBe(undefined);
        expect(validateError.name).toBe(undefined);

        validateError.addProperties(['email', 'name']);
        expect(validateError.email instanceof Object).toBe(true);
        expect(validateError.name instanceof Object).toBe(true);
    })
})