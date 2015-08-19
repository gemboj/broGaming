describe('login test', function(){
    beforeEach(function () {
        this.loggedUserRepo = {
            insertLoggedUser: function(){
                return new Promise(function (resolve, reject) {
                    reject();
                });
            }
        };
        this.emptyRepo = {
            insertLoggedUser: function(){
                return new Promise(function (resolve, reject) {
                    resolve();
                });
            }
        };

        this.resolved = function(){};
        this.rejected = function(){};

        spyOn(this, 'resolved');
        spyOn(this, 'rejected');
        spyOn(this.loggedUserRepo, 'insertLoggedUser').and.callThrough();
        spyOn(this.emptyRepo, 'insertLoggedUser').and.callThrough();
    });

    it('it resolves when user is not already logged and inserts that user into db', function(done){
        var that = this,
            login = new Login(this.emptyRepo.insertLoggedUser);

        login.do('username')
            .then(function () {
                that.resolved();
            })
            .catch(function () {
                that.rejected();
            })
            .then(function () {
                expect(that.resolved).toHaveBeenCalled();
                expect(that.emptyRepo.insertLoggedUser).toHaveBeenCalled();

                done();

            })
            .catch(function () {
                done.fail();
            });
    }, 2000)

    it('it rejects with message when user is already logged', function(done){
        var that = this,
            login = new Login(this.loggedUserRepo.insertLoggedUser);

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