describe('login test', function(){
    beforeEach(function () {
        this.loggedUserRepo = {
            findUsersByUsername: function(input){
                return new Promise(function (resolve, reject) {
                    resolve([new LoggedUser(input.username)]);
                });
            },
            insertUser: function(){
                return new Promise(function (resolve, reject) {
                    resolve();
                });
            }
        };
        this.emptyRepo = {
            findUsersByUsername: function(input){
                return new Promise(function (resolve, reject) {
                    resolve([]);
                });
            },
            insertUser: function(){
                return new Promise(function (resolve, reject) {
                    resolve();
                });
            }
        };

        this.resolved = function(){};
        this.rejected = function(){};

        spyOn(this, 'resolved');
        spyOn(this, 'rejected');
        spyOn(this.loggedUserRepo, 'insertUser').and.callThrough();
        spyOn(this.emptyRepo, 'insertUser').and.callThrough();
    });

    it('it resolves when user is not already logged and inserts that user into db', function(done){
        var that = this,
            login = new Login(this.emptyRepo);

        login.do('username')
            .then(function () {
                that.resolved();
            })
            .catch(function () {
                that.rejected();
            })
            .then(function () {
                expect(that.resolved).toHaveBeenCalled();
                expect(that.emptyRepo.insertUser).toHaveBeenCalled();

                done();

            })
            .catch(function () {
                done.fail();
            });
    }, 2000)

    it('it rejects with message when user is already logged', function(done){
        var that = this,
            login = new Login(this.loggedUserRepo);

        login.do({username: 'username'})
            .then(function () {
                that.resolved();
            })
            .catch(function () {
                that.rejected();
            })
            .then(function () {
                expect(that.rejected).toHaveBeenCalled();
                done();
            })
            .catch(function () {
                done.fail();
            });
    })
})