describe('JoinRoom', function(){
    beforeEach(function(){
        var that = this;
        this.users = [];
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

        this.getUsernamesInRoomid = function(roomid, t){
            return Promise.resolve(that.users);
        };

        this.sendUsernamesList = function(users){

        };

        spyOn(this, 'transaction').and.callThrough();
        spyOn(this, 'usernameJoinsRoomid').and.callThrough();
        spyOn(this, 'getUsernamesInRoomid').and.callThrough();
        spyOn(this, 'sendUsernamesList');


    });

    it('joins choosed room and sends usernames in that room', function(done){
        var that = this;

        this.joinRoom = new JoinRoom(this.transaction, this.usernameJoinsRoomid, this.getUsernamesInRoomid, this.sendUsernamesList);

        this.joinRoom.do('username', 2)
            .then(function(){
                expect(that.transaction).toHaveBeenCalled();
                expect(that.usernameJoinsRoomid).toHaveBeenCalledWith('username', 2, that.transactionObj);
                expect(that.getUsernamesInRoomid).toHaveBeenCalledWith(2, that.transactionObj);
                expect(that.sendUsernamesList).toHaveBeenCalledWith('username', 'roomUsers', {2: that.users});
                done();
            })
            .catch(function(){
                done.fail();
            });
    })

    it('joins room 0 when roomId is undefined', function(done){
        var that = this;

        this.joinRoom = new JoinRoom(this.transaction, this.usernameJoinsRoomid, this.getUsernamesInRoomid, this.sendUsernamesList);

        this.joinRoom.do('username')
            .then(function(){
                expect(that.transaction).toHaveBeenCalled();
                expect(that.usernameJoinsRoomid).toHaveBeenCalledWith('username', 0, that.transactionObj);
                expect(that.getUsernamesInRoomid).toHaveBeenCalledWith(0, that.transactionObj);
                expect(that.sendUsernamesList).toHaveBeenCalledWith('username', 'roomUsers', {0: that.users});
                done();
            })
            .catch(function(){
                done.fail();
            });
    })

    it('wont send users when transaction fails', function(done){
        var that = this;

        this.joinRoom = new JoinRoom(this.transaction, this.usernameJoinsRoomidReject, this.getUsernamesInRoomid, this.sendUsernamesList);

        this.joinRoom.do('username')
            .then(function(){

                done.fail();
            })
            .catch(function(){
                expect(that.sendUsernamesList).not.toHaveBeenCalled();

                done();
            });
    })
});