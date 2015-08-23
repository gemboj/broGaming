describe('JoinRoom', function(){
    beforeEach(function(){
        var that = this;
        this.users = [new User('username', 'a', 0, 1)];
        this.usersNicks = ['username'];
        this.transactionObj = {};

        var that = this;
        this.transaction = function(func){
            return func(that.transactionObj)
                .then(function(data){
                    //commit
                    return data;
                })
                .catch(function(err){
                    //rollback
                    throw err;
                })
        };

        this.usernameJoinsRoomid = function(username, roomid, t){
            return Promise.resolve();
        };

        this.usernameJoinsRoomidReject = function(username, roomid, t){
            return Promise.reject();
        };

        this.getUsersInRoomid = function(roomid, t){
            return Promise.resolve(that.users);
        };

        this.send = function(users){

        };

        spyOn(this, 'transaction').and.callThrough();
        spyOn(this, 'usernameJoinsRoomid').and.callThrough();
        spyOn(this, 'getUsersInRoomid').and.callThrough();
        spyOn(this, 'send');


    });

    it('calls db functions within the same transaction', function(done){
        var that = this;

        this.joinRoom = new JoinRoom(this.transaction, this.usernameJoinsRoomid, this.getUsersInRoomid, this.send);

        this.joinRoom.do('username', 2)
            .then(function(){
                expect(that.transaction).toHaveBeenCalled();
                expect(that.usernameJoinsRoomid).toHaveBeenCalledWith('username', 2, that.transactionObj);
                expect(that.getUsersInRoomid).toHaveBeenCalledWith(2, that.transactionObj);
                done();
            })
            .catch(function(err){
                done.fail(err);
            });
    });

    it('sends error when transaction fails', function(done){
        var that = this;

        this.joinRoom = new JoinRoom(this.transaction, this.usernameJoinsRoomidReject, this.getUsersInRoomid, this.send);

        this.joinRoom.do('username')
            .then(function(){

                done.fail();
            })
            .catch(function(){
                expect(that.send).toHaveBeenCalledWith('username', 'error', 'could not join room');

                done();
            });
    })

    it('joins choosen room', function(done){
        var that = this;

        this.joinRoom = new JoinRoom(this.transaction, this.usernameJoinsRoomid, this.getUsersInRoomid, this.send);

        this.joinRoom.do('username', 2)
            .then(function(){
                expect(that.usernameJoinsRoomid).toHaveBeenCalledWith('username', 2, that.transactionObj);
                done();
            })
            .catch(function(err){
                done.fail(err);
            });
    });


    it('joins room 0 when roomId is undefined', function(done){
        var that = this;

        this.joinRoom = new JoinRoom(this.transaction, this.usernameJoinsRoomid, this.getUsersInRoomid, this.send);

        this.joinRoom.do('username')
            .then(function(){
                expect(that.transaction).toHaveBeenCalled();
                expect(that.usernameJoinsRoomid).toHaveBeenCalledWith('username', 0, that.transactionObj);
                done();
            })
            .catch(function(err){
                done.fail(err);
            });
    });

    it('gets users from joined room', function(done){
        var that = this;

        this.joinRoom = new JoinRoom(this.transaction, this.usernameJoinsRoomid, this.getUsersInRoomid, this.send);

        this.joinRoom.do('username', 2)
            .then(function(){
                expect(that.getUsersInRoomid).toHaveBeenCalledWith(2, that.transactionObj);
                done();
            })
            .catch(function(err){
                done.fail(err);
            });
    });

    it('sends back usernames from joined room', function(done){
        var that = this;

        this.joinRoom = new JoinRoom(this.transaction, this.usernameJoinsRoomid, this.getUsersInRoomid, this.send);

        this.joinRoom.do('username', 2)
            .then(function(){
                expect(that.transaction).toHaveBeenCalled();
                expect(that.send).toHaveBeenCalledWith('username', 'roomUsers', {2: that.usersNicks});
                done();
            })
            .catch(function(err){
                done.fail(err);
            });
    });
});